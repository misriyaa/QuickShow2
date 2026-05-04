import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../library/dateFormat";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch shows data (matches Screenshot 1)
  const getAllShows = async () => {
    try {
      // Using dummy data as per your project structure
      setShows(dummyShowsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />

      {/* Table Container (matches Screenshot 2) */}
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          {/* Table Header */}
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>

          {/* Table Body (matches Screenshot 3) */}
          <tbody className="text-sm font-light">
            {shows.map((show, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                {/* Changed from show.movie.title to show.title */}
                <td className="p-2 min-w-45 pl-5">
                  {show?.title || "Untitled Movie"}
                </td>

                {/* Changed from show.showDateTime to show.release_date */}
                <td className="p-2">
                  {show?.release_date ? dateFormat(show.release_date) : "N/A"}
                </td>

                {/* If your dummy data doesn't have occupiedSeats yet, we default to 0 */}
                <td className="p-2">
                  {show?.occupiedSeats
                    ? Object.keys(show.occupiedSeats).length
                    : 0}
                </td>

                <td className="p-2">
                  {currency}{" "}
                  {show?.occupiedSeats && show?.showPrice
                    ? Object.keys(show.occupiedSeats).length * show.showPrice
                    : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
