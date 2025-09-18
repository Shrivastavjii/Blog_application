import { Blog } from '../models/blogModel.js'
import {v2 as cloudinary} from 'cloudinary'
import mongoose from 'mongoose'
import Comment from "../models/Comment.js";
export const createBlog = async (req, res) => {

  try {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog photo is required" });
    }

    const { blogImage } = req.files;
    const allowedFormats = ["image/jpeg","image/jpg","image/png","image/webp"];

    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res
        .status(200)
        .json({ message: "Invalid photo format. Only jpg and png are allowed" });
    }



    const { title,category,about } = req.body

    if (!title || !category || !about) {
       
      return res.status(200).json({ message: "please fill all required fields" })

    }

    const adminName=req?.user?.name
    const adminPhoto=req?.user?.photo?.url
    const createdBy=req?.user?._id

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );
    console.log(cloudinaryResponse)
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
    }

    const blogData = await Blog.create({
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {

        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,

      }
    })

     res.status(200).json({ message: "blog succesfully created",blogData,})
      

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Server error",error });
  }

}

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  await blog.deleteOne();
  res.status(200).json({ message: "Blog deleted successfully" });
};

export const getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find();
  res.status(200).json(allBlogs);
};

export const getSingleBlogs = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(blog);
};

export const getMyBlogs = async (req, res) => {
  const createdBy = req.user._id;
  const myBlogs = await Blog.find({ createdBy });
  res.status(200).json(myBlogs);
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(updatedBlog);
};

// ✅ Add Comment Controller
export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      content,
      blogId,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comments = await Comment.find({ blogId })
      .populate("createdBy", "name email _id") // sirf name & email laa raha
      .sort({ createdAt: -1 }); // latest comment sabse upar
      console.log("🔥 Comments from DB:", comments);
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ✅ Update Comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("blogId");
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // ✅ only comment owner can update (blog admin cannot update)
    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to edit" });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("blogId");
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (
      comment.createdBy.toString() !== req.user._id.toString() &&
      comment.blogId.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to delete" });
    }

    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
