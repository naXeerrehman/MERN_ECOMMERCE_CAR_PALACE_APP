import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons"; // Import faRegStar from regular icons
import "../App.css"
import TextEditor from "./TextEditor";
const Reviews = () => {
  const { id } = useParams(); // Get vehicle ID from URL
  const [newReview, setNewReview] = useState("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(1); // For rating
  const [loading, setLoading] = useState(false);

  // Handle adding a new comment
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview || !userName) return;

    setLoading(true); // Set loading to true while posting comment

    const reviewData = {
      userName,
      review: newReview,
      rating, // Add rating
      createdAt: new Date().toISOString(),
    };

    try {
      // Make an API request to store the comment in the database
      const response = await fetch(`http://localhost:5000/api/Reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Review added:", data.review);
        // Optionally update the UI with the new comment if needed
      } else {
        throw new Error("Error adding review");
      }

      // Clear input fields
      setNewReview("");
      setUserName("");
      setRating(0); // Reset rating
    } catch (error) {
      console.error("Error adding review:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle rating change for the new comment
  const handleRating = (starIndex) => {
    setRating(starIndex); // Set the rating when a star is clicked
  };

  // Render the star icons dynamically based on the rating
  const renderStars = (currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= currentRating) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className="text-yellow-500 cursor-pointer"
            onClick={() => handleRating(i)} // Click handler to set rating
          />
        );
      } else if (i === Math.floor(currentRating) + 0.5) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            className="text-yellow-500 cursor-pointer"
            onClick={() => handleRating(i)} // Click handler to set rating
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faRegStar}
            className="text-gray-300 cursor-pointer"
            onClick={() => handleRating(i)} // Click handler to set rating
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="container ml-[150px] lg:ml-[500px] w-[400px] border border-black px-5 mt-[30px]">
      {/* Add Comment Form */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold">Add a Review:</h3>
        <form onSubmit={handleAddReview} className="mt-2">
          <div className="mb-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              className="p-2 border border-gray-300 rounded w-[300px]"
              required
            />
          </div>
          <div className="mb-2">
            <TextEditor
              value={newReview}
              onChange={(value) => setNewReview(value)}
              placeholder="Write your review here..."
              className="p-2 border border-gray-300 rounded w-[350px]"
              required
            />
          </div>
          <div className="mb-2">
            <div className="flex">{renderStars(rating)}</div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded mb-3"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
