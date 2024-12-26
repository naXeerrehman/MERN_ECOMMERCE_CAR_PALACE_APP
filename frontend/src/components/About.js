import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AboutPage = () => {
  const [icons, setIcons] = useState([]);
  const [editingIconId, setEditingIconId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDetails, setEditingDetails] = useState({
    link: "",
    image: null,
  });

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/icons");
      const data = await response.json();
      setIcons(data);
    } catch (error) {
      console.error("Failed to fetch icons", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIcon = async (id) => {
    try {
      const formData = new FormData();
      formData.append("link", editingDetails.link);
      formData.append("image", editingDetails.image);

      const response = await fetch(`http://localhost:5000/api/icons/${id}`, {
        method: "PUT",
        body: formData,
      });
      const updatedIcon = await response.json();
      setIcons((prevIcons) =>
        prevIcons.map((icon) =>
          icon._id === updatedIcon._id ? updatedIcon : icon
        )
      );
      setEditingIconId(null);
    } catch (error) {
      console.error("Failed to edit icon", error);
    }
  };

  const handleDeleteIcon = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/icons/${id}`, {
        method: "DELETE",
      });
      setIcons((prevIcons) => prevIcons.filter((icon) => icon._id !== id));
    } catch (error) {
      console.error("Failed to delete icon", error);
    }
  };

  return (
    <div className="mb-10">
      {/* Header Section */}
      <header className="py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 bg-black w-[300px] rounded-md mx-auto">
          About Us
        </h1>
        <p className="text-lg">
          Your one-stop destination for managing vehicles seamlessly and
          efficiently.
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Who We Are Section */}
        <section className="w-full bg-yellow-500 p-2 rounded-md">
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-lg mb-4">
            We are a dedicated team providing comprehensive solutions for
            vehicle management, ensuring a seamless experience for our clients.
          </p>
          <p>
            Our platform offers tools and services tailored to meet the needs of
            individuals and businesses alike.
          </p>
        </section>

        {/* Our Mission Section */}
        <section className="w-full bg-yellow-500 p-2 rounded-md">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            At the core of our mission is a commitment to innovation,
            sustainability, and excellence. We aim to revolutionize the vehicle
            management industry by providing tools that empower individuals and
            businesses to make informed decisions and optimize their resources.
          </p>
        </section>

        {/* Our Services Section */}
        <section className="w-full bg-yellow-500 p-2 rounded-md">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <ul className="list-disc pl-6 text-lg">
            <li>Vehicle tracking and management</li>
            <li>Real-time updates and notifications</li>
            <li>Maintenance scheduling and reminders</li>
            <li>Customer support for all inquiries</li>
          </ul>
        </section>

        {/* Icons Section */}
  <section className="w-full bg-yellow-500 p-2 rounded-md">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center mt-5">
              <FontAwesomeIcon
                icon={faCar}
                size="3x"
                className="animate-zoomInOut" // Apply the zoom-in/zoom-out animation
              />
              <div className="font-bold ml-2 mt-2">Loading...</div>
            </div>
          ) : (
            <div className="gap-x-1 grid grid-cols-5 w-[320px]">
              {icons.map((icon) => (
                <div key={icon._id}>
                  <div className="w-[100px]">
                    {editingIconId === icon._id ? (
                      <>
                        <input
                          type="text"
                          value={editingDetails.link}
                          onChange={(e) =>
                            setEditingDetails({
                              ...editingDetails,
                              link: e.target.value,
                            })
                          }
                          placeholder="Enter link"
                          className="border p-2 w-[300px] relative bottom-[100px]"
                        />
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditingDetails({
                              ...editingDetails,
                              image: e.target.files[0],
                            })
                          }
                          className="border p-2 w-[300px] relative bottom-[100px]"
                        />
                      </>
                    ) : (
                      <a
                        href={icon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={icon.image}
                          alt={icon.link}
                          className="w-[50px] h-[50px] rounded-full border"
                        />
                      </a>
                    )}
                  </div>
                  {/* buttons */}
                  <div className="py-1 w-[100px] flex">
                    {editingIconId === icon._id ? (
                      <>
                        <button
                          onClick={() => handleEditIcon(icon._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIconId(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md block w-full"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingIconId(icon._id);
                            setEditingDetails({ link: icon.link, image: null });
                          }}
                          className="bg-yellow-500 border text-white px-1 py-1 rounded-md mr-2"
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteIcon(icon._id)}
                          className="bg-red-500 text-white px-1 py-1 rounded-md"
                        >
                          <MdDelete />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p>
            <span
              className="font-bold
          "
            >
              Pro tip:
            </span>
            To add Whataspp number, replace your number here
            "https://wa.me/0123456789" and add in the link.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
