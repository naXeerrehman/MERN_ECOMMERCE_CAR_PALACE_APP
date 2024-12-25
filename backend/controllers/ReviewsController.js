import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  const { userName, review, rating } = req.body;
  const { vehicleId } = req.params;

  try {
    // Create a new comment object with the incoming data
    const newReview = new Review({
      vehicleId,
      userName,
      review,
      rating,
      createdAt: new Date(),
    });

    // Save the comment to the database
    await newReview.save();

    // Respond with the added comment data
    res.json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review" });
  }
};

// Get reviews for a specific vehicle
export const getReviewByVehicle = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const review = await Review.find({ vehicleId }).sort({ createdAt: -1 });
    res.json(review);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};
