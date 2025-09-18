import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useStore } from "../context/ContextProvider";

function Detail() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const [blogs, setblogs] = useState({});
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const {profile,setProfile}=useStore()
  console.log(profile)
  console.log(blogs);
  useEffect(() => {
    const fetchblogs = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/blogs/single-blog/${id}`,

          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(data);
        setblogs(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchblogs();
  }, [id]);

  // ✅ Fetch comments
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/blogs/comments/${id}`,
        { withCredentials: true }
      );
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const { register, handleSubmit, reset } = useForm();
  // ✅ Add new comment
  const onSubmit = async (formData) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/blogs/comment/${id}`,
        { content: formData.content },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Comment added!");
        setComments([data.comment, ...comments]); // update state instantly
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    }
  };

  // ✅ Update comment
  const updateComment = async (commentId) => {
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/blogs/comments/${commentId}`,
        { content: editingContent },
        { withCredentials: true }
      );
      if (data.success) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, content: editingContent } : c
          )
        );
        setEditingId(null);
        setEditingContent("");
        toast.success("Comment updated!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update comment");
    }
  };

  // ✅ Delete comment
  const deleteComment = async (commentId) => {
    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/blogs/comments/${commentId}`,
        { withCredentials: true }
      );
      if (data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success("Comment deleted!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div>
      <div>
        {blogs && (
          <section className="container mx-auto p-4">
            <div className="bg-slate-800 rounded-lg text-center">
              <div className="text-blue-500 uppercase text-xl font-bold mb-4 ml-3 mt-3">
                {blogs?.category}
              </div>
              <h1 className="text-4xl font-bold mb-6 ml-3">{blogs?.title}</h1>

              <div className="flex items-center mb-6 justify-center">
                <img
                  src={blogs?.adminPhoto}
                  alt="author_avatar"
                  className="w-12 h-12 rounded-full mr-4 object-cover mb-"
                />
                <p className="text-lg font-semibold text-center">{blogs?.adminName}</p>
              </div>

            </div>
            <div className="flex flex-col md:flex-row ml-3 md:gap-x-6 gap-y-6 ">
              {blogs?.blogImage && (
                <img
                  src={blogs?.blogImage?.url || blogs?.blogImage}
                  alt="mainblogsImg"
                  className="md:w-1/2 w-full h-[500px] mb-6 rounded-lg shadow-lg cursor-pointer border object-cover"
                />
              )}
              <div className="md:w-1/2 md:pl-6 w-full max-w-3xl bg-slate-800 shadow-lg rounded-lg p-6 h-[69vh] overflow-y-auto mr-3">
                <p className="text-lg mb-6 text-white">{blogs?.about}</p>
                {/* Add more content here if needed */}
              </div>
            </div>
            {/* ✅ Comment Section */}

            <div>
              <h2 className="text-2xl font-bold mb-4">Comments</h2>

              {/* Comment Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-2 mb-6"
              >
                <input
                  type="text"
                  {...register("content", { required: true })}
                  placeholder="Write a comment..."
                  className="flex-1 border rounded px-3 py-2 text-black"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Post
                </button>
              </form>

              {/* Comments List */}

              <div>
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c._id} className="border p-3 rounded">
                      <p className="font-medium mb-3">
                        {c.createdBy?.name || "Anonymous"}
                      </p>

                      {/* Edit Mode */}
                      {editingId === c._id ? (
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="flex-1 border rounded px-2 py-1 text-black"
                          />
                          <button
                            onClick={() => updateComment(c._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-white mb-2">{c.content}</p>
                      )}
                      <p className="text-xs text-white mb-3">
                        {new Date(c.createdAt).toLocaleString()}
                      </p>

                      {/* ✅ Button logic */}

                      {profile?.user && (
                        <div className="flex gap-3">
                          {/* Edit → only comment owner */}
                          {profile?.user?._id=== c.createdBy?._id && (
                            <button
                              className="text-blue-400 text-sm"
                              onClick={() => {
                                setEditingId(c._id);
                                setEditingContent(c.content);
                              }}
                            >
                              Edit
                            </button>
                          )}

                          {/* Delete → comment owner OR blog owner */}
                          {(profile?.user?._id === c.createdBy?._id ||
                            profile?.user?._id=== blogs.createdBy?._id) && (
                              <button
                                className="text-red-500 text-sm"
                                onClick={() => deleteComment(c._id)}
                              >
                                Delete
                              </button>
                            )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Detail;
