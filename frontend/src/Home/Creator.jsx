import React, { useEffect, useState } from "react";
import axios from 'axios';
function Creator() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [admin, setAdmin] = useState([]);
  console.log(admin);
  useEffect(() => {
    const fetchAdmins = async () => {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/users/admins`,
        {
          withCredentials: true,
        }
      );
      console.log(data.admins);
      setAdmin(data.admins);
    };
    fetchAdmins();
  }, []);
  return (
    <div className=" container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 ml-10 px-5">Popular Creators</h1>
      <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7 rounded-full my-5">
        {admin && admin.length > 0 ? (
          admin.slice(0, 5).map((element) => {
            return (
              <div key={element._id}>
                <div className="">
                  <img
                    src={element.photo.url}
                    alt="blog"
                    className="md:w-56 md:h-56 object-cover border border-black rounded-full items-center "
                  />
                  <div className="text-center md:ml-[-10px]">
                    <p>{element.name}</p>
                    <p className="text-gray-600 text-xs">{element.role}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
      </div>
    </div>
  );
}

export default Creator;
