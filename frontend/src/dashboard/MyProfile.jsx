import React from "react";
import { useStore } from "../context/ContextProvider";

function MyProfile() {
  const { profile } = useStore();
  console.log(profile?.user);
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className=" bg-black shadow-lg rounded-lg overflow-hidden max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
          <div className="relative">

               {/* Banner Image */}
            <img
              src={profile?.user?.photo?.url}
              alt="avatar"
              className="w-full h-48 object-cover object-center"
            />

            {/* Profile Avatar */}
            <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2">
              <img
                src={profile?.user?.photo?.url}
                alt="avatar"
                className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md object-cover object-center"
              />
            </div>
          </div>
          <div className="px-6 py-10 mt-6">
            <h2 className="text-center text-2xl font-semibold text-white">
              {profile?.user?.name}
            </h2>
            <p className="text-center text-white mt-2">
              {profile?.user?.email}
            </p>
            <p className="text-center text-white mt-2">
              {profile?.user?.phone}
            </p>
            <p className="text-center text-white mt-2">
              {profile?.user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
