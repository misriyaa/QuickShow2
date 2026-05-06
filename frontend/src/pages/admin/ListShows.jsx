import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

 const getAllShows = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/shows/now-playing");
    const data = await res.json();

    if (data.success) {
      setShows(data.movies);
    }
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

      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Year</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {shows.map((show, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 pl-5">
                  {show?.title || "Untitled Movie"}
                </td>

                {/* OMDb gives only year */}
                <td className="p-2">
                  {show?.release_date || "N/A"}
                </td>

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