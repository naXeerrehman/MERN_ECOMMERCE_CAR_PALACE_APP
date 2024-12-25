import React, { useState, useEffect } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaCartArrowDown } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const AdminPanelHome = () => {
  const [stats, setStats] = useState({
    placed: 0,
    shipped: 0,
    delivered: 0,
    totalEarnings: 0,
    totalProductsSold: 0,
    totalOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/stats");
      const data = await response.json();
      console.log(data);

      setStats({
        placed: data.placed || 0,
        shipped: data.shipped || 0,
        delivered: data.delivered || 0,
        totalEarnings:typeof data.totalEarnings === "number" ? data.totalEarnings : 0,
        totalProductsSold: data.totalProductsSold || 0,
        totalOrders: data.totalOrders || 0,
      });

      setIsLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setIsLoading(false); // Set loading to false if there's an error
    }
  };

  useEffect(() => {
    fetchStats();
    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  const chartData = {
    labels: ["Placed", "Shipped", "Delivered"],
    datasets: [
      {
        label: "Orders",
        data: [stats.placed, stats.shipped, stats.delivered],
        backgroundColor: ["green", "yellow", "orange"], // Black shades for the statuses
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  };

  return (
    <div>
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
        <div>
          <div className="mt-4 flex flex-col lg:flex-row gap-x-[40px] mx-[130px] lg:mx-0 gap-y-4">
            <div className="w-[250px] px-2 border-b-4 border-green-500 shadow-inner flex justify-between text-2xl">
              <div className="text-green-500">
                <div>Earnings</div>
                <div>${Number(stats.totalEarnings).toFixed(2)}</div>
              </div>
              <AiFillDollarCircle className="mt-[40px] text-3xl text-green-500" />
            </div>
            <div className="w-[250px] px-2 border-b-4 border-yellow-500 shadow-inner flex justify-between text-2xl">
              <div className="text-yellow-500">
                <div>Products Sold</div>
                <div>{stats.totalProductsSold}</div>
              </div>
              <FaCartArrowDown className="mt-[40px] text-3xl text-yellow-500" />
            </div>
            <div className="w-[250px] px-2 border-b-4 border-orange-500 shadow-inner flex justify-between text-2xl">
              <div className="text-orange-500">
                <div>Completed Orders</div>
                <div>{stats.totalOrders}</div>
              </div>
              <BsCartCheckFill className="mt-[40px] text-3xl text-orange-500" />
            </div>
          </div>
          {/* Chart */}
          <div className="border border-black p-4 mt-2 h-[300px] w-[500px] mx-auto lg:mx-0 mb-5">
            <h2 className="text-lg font-bold mb-2">Order Status Chart</h2>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelHome;
