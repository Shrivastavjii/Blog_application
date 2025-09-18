import React from "react";
import { useStore } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
function Trending() {
  const { blogs } = useStore();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="px-8">
      <h1 className="text-2xl font-semibold mb-6 ml-10">Trending</h1>
      <Carousel responsive={responsive}>
        {blogs && blogs.length > 0 ? (
          blogs.slice(0, 6).map((element) => {
            return (
              <div
                key={element._id}
                className="w-[240px] mx-auto bg-black border border-gray-400 rounded-lg shadow-md gap-4"
              >
                <Link to={`/blog/${element._id}`}>
                  <div className="relative">
                    <img
                      src={element.blogImage.url}
                      alt="blog"
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      {element.category}
                    </div>
                  </div>
                  <div className="p-3 bg-black rounded-b-lg flex flex-col justify-between">
                    <h1
                      className="text-lg font-bold mb-2 overflow-hidden text-ellipsis"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {element.title}
                    </h1>
                    <div className="flex items-center">
                      <img
                        src={element.adminPhoto}
                        alt="author_avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p className="ml-3 text-gray-400 text-sm">
                        {element.adminName}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className=" flex h-screen items-center justify-center">
            Loading....
          </div>
        )}
      </Carousel>
    </div>
  );
}

export default Trending;
