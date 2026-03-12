import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment, MdOutlineBookmarkBorder, MdBookmark } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // ================= Time formatting like Instagram =================
  const [timeAgo, setTimeAgo] = useState("");

  const computeTimeAgo = () => {
    const now = new Date();
    const postTime = new Date(post.createdAt);
    const diff = Math.floor((now - postTime) / 1000); // seconds

    if (diff < 60) return "a few seconds ago";
    else if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    else if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    else return `${Math.floor(diff / 86400)}d ago`;
  };

  useEffect(() => {
    setTimeAgo(computeTimeAgo());
    const interval = setInterval(() => setTimeAgo(computeTimeAgo()), 60000); // update every min
    return () => clearInterval(interval);
  }, [post.createdAt]);

  // ================= LIKE =================
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await axios.get(`${serverUrl}/api/post/like/${post._id}`, { withCredentials: true });
      const updatedPost = res.data;
      const updatedPostData = postData.map(p => p._id === post._id ? updatedPost : p);
      dispatch(setPostData(updatedPostData));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLiking(false);
    }
  };

  // ================= COMMENT =================
  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, { message }, { withCredentials: true });
      const updatedPost = res.data;
      const updatedPostData = postData.map(p => p._id === post._id ? updatedPost : p);
      dispatch(setPostData(updatedPostData));
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SAVE =================
  const handleSaved = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/post/saved/${post._id}`, { withCredentials: true });
      dispatch(setUserData(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${serverUrl}/api/post/delete/${post._id}`, { withCredentials: true });
      const updatedPosts = postData.filter(p => p._id !== post._id); // compute first
      dispatch(setPostData(updatedPosts)); // then dispatch

      // remove from saved posts if exists
      if (userData.saved.includes(post._id)) {
        dispatch(setUserData({ ...userData, saved: userData.saved.filter(id => id !== post._id) }));
      }

      socket?.emit("postDeleted", { postId: post._id });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete post");
    }
  };

  // ================= SOCKET UPDATES =================
  useEffect(() => {
    socket?.on("postDeleted", (data) => {
      const updatedPosts = postData.filter(p => p._id !== data.postId);
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      socket?.off("postDeleted");
    };
  }, [socket, postData, dispatch]);

  const isLiked = post.likes.includes(userData._id);
  const isSaved = userData.saved.includes(post._id);

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/50 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/10 mb-8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${post.author.userName}`)}>
          <img src={post.author.profileImage || dp} className="w-12 h-12 rounded-full border border-white/20 object-cover shadow-sm" />
          <div>
            <h1 className="text-white font-semibold">{post.author.userName}</h1>
            <p className="text-sm text-gray-400">{timeAgo}</p>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowOptions(!showOptions)} className="p-2 rounded-full hover:bg-white/10 transition">
            <BsThreeDots className="text-white text-xl" />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-10 bg-black border border-white/20 shadow-lg rounded-xl min-w-[140px] overflow-hidden animate-fadeIn">
              {userData._id === post.author._id && (
                <button onClick={handleDelete} className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-600/20 transition flex items-center gap-2">
                  <RiDeleteBin6Line /> Delete
                </button>
              )}
              <button className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/10 transition flex items-center gap-2">Report</button>
            </div>
          )}
        </div>
      </div>

      {/* Media */}
      <div className="bg-black">
        {post.mediaType === "image" && <img src={post.media} className="w-full max-h-[600px] object-cover rounded-xl transition-transform duration-300 hover:scale-[1.01]" />}
        {post.mediaType === "video" && <VideoPlayer media={post.media} />}
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex justify-between mb-2">
          <div className="flex gap-6">
            <button onClick={handleLike} disabled={isLiking} className="hover:scale-110 transition">
              {isLiked ? <GoHeartFill className="text-red-500 w-7 h-7" /> : <GoHeart className="text-white w-7 h-7" />}
            </button>
            <button onClick={() => setShowComment(!showComment)} className="hover:scale-110 transition">
              <MdOutlineComment className="text-white w-7 h-7" />
            </button>
          </div>
          <button onClick={handleSaved} className="hover:scale-110 transition">
            {isSaved ? <MdBookmark className="text-yellow-400 w-7 h-7" /> : <MdOutlineBookmarkBorder className="text-white w-7 h-7" />}
          </button>
        </div>

        {/* Likes */}
        {post.likes.length > 0 && <p className="text-white font-medium">{post.likes.length} likes</p>}

        {/* Caption */}
        {post.caption && (
          <p className="text-gray-300 mt-2 leading-relaxed">
            <span className="text-white font-semibold cursor-pointer" onClick={() => navigate(`/profile/${post.author.userName}`)}>
              {post.author.userName}
            </span>{" "}
            {post.caption}
          </p>
        )}

        {/* View comments */}
        {post.comments.length > 0 && !showComment && (
          <button className="text-gray-400 mt-1 hover:text-gray-200 transition" onClick={() => setShowComment(true)}>
            View all {post.comments.length} comments
          </button>
        )}
      </div>

      {/* Comment Section */}
      {showComment && (
        <div className="border-t border-white/10 p-4">
          <div className="flex gap-3 mb-3">
            <img src={userData.profileImage || dp} className="w-10 h-10 rounded-full border border-white/20" />
            <div className="flex-1 relative">
              <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 placeholder-gray-400" placeholder="Write a comment..." />
              <button onClick={handleComment} className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition">
                <IoSendSharp className="text-white" />
              </button>
            </div>
          </div>

          {/* Comments list */}
          <div className="max-h-72 overflow-y-auto custom-scrollbar">
            {post.comments.map((c, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-white/10">
                <img src={c.author?.profileImage || dp} className="w-10 h-10 rounded-full border border-white/10" />
                <div>
                  <p className="text-white">
                    <span className="font-semibold mr-2">{c.author?.userName}</span>
                    {c.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
