import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useRoles from "../../Hooks/useRoles";

// A simple tag input component that lets users type and add tags.
function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedInput = input.trim();
      if (trimmedInput && !tags.includes(trimmedInput)) {
        setTags([...tags, trimmedInput]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input.length && tags.length) {
      setTags(tags.slice(0, tags.length - 1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-wrap items-center border rounded-lg p-2">
      {tags.map((tag, index) => (
        <div key={index} className="bg-blue-200 text-blue-800 rounded-full px-3 py-1 m-1 flex items-center">
          <span>{tag}</span>
          <button type="button" onClick={() => removeTag(index)} className="ml-2 text-sm text-blue-800">
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow outline-none p-1"
        placeholder="Type a tag and press enter"
      />
    </div>
  );
}

export default function Edit() {
  // 'post' here is the existing post data passed from backend via Inertia
  const { auth, post: currentPost } = usePage().props;
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

  // Initialize the form with current post values.
  const { data, setData, post, processing, errors } = useForm({
    title: currentPost.title || "",
    url: currentPost.url || "",
    content: currentPost.content || "",
    category: currentPost.category || "",
    tags: currentPost.tags || [],
    image: null,
    featured_image: null,
    attachment: null,
    status: currentPost.status || "published",
  });

  // Helper to update tags.
  const setTags = (newTags) => {
    setData("tags", newTags);
  };

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      // For file fields, only append if a new file has been provided.
      if ((key === "image" || key === "featured_image" || key === "attachment") && !data[key]) {
        return; // Skip appending this key
      }
      if (key === "tags") {
        // Convert tags array to JSON string.
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    // Use post() to submit the update.
    post(route("create-posts.update", currentPost.id), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert("Post updated successfully.");
      },
      onError: (errors) => {
        console.error("Error updating Post:", errors);
        alert("Failed to update the Post. Please try again.");
      },
    });
  }

  return (
    <MainLayout>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6">
          <h1 className="text-xl font-bold text-gray-700 text-center">Edit Post</h1>

          {/* First Row: Title and Category (7:3 ratio) */}
          <div className="grid grid-cols-10 gap-8">
            <div className="col-span-7">
              <label className="block text-gray-700 font-medium">
                Post Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
                placeholder="Enter Post Title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div className="col-span-3">
              <label className="block text-gray-700 font-medium">Category</label>
              <select
                id="category"
                name="category"
                value={data.category}
                onChange={(e) => setData("category", e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
              >
                <option value="" disabled hidden>
                  Select Category
                </option>
                <option value="General Discussion">General Discussion</option>
                <option value="Academic Research">Academic Research</option>
                <option value="Student Life">Student Life</option>
                <option value="Career Opportunities">Career Opportunities</option>
                <option value="Events & Workshops">Events & Workshops</option>
                <option value="Scholarships & Funding">Scholarships & Funding</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Second Row: URL (disabled) and Tags (7:3 ratio) */}
          <div className="grid grid-cols-10 gap-8">
            <div className="col-span-7">
              <label className="block text-gray-700 font-medium">Post URL</label>
              <input
                type="url"
                value={data.url}
                disabled
                onChange={(e) => setData("url", e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-200 p-4 bg-gray-100 text-sm cursor-not-allowed"
                placeholder="Auto-generated from title"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-gray-700 font-medium">Tags</label>
              <TagInput tags={data.tags} setTags={setTags} />
              {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
            </div>
          </div>

          {/* Third Row: Content (8 columns) and File Uploads (4 columns) */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8">
              <label className="block text-gray-700 font-medium">
                Content <span className="text-red-500">*</span>
              </label>
              <div
                className="mt-1 w-full rounded-lg border border-gray-200"
                style={{ height: "300px", overflowY: "auto" }}
              >
                <ReactQuill
                  theme="snow"
                  value={data.content}
                  onChange={(value) => setData("content", value)}
                  placeholder="Enter content"
                  style={{ height: "300px", maxHeight: "300px" }}
                />
              </div>
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
            </div>
            <div className="col-span-4 flex flex-col space-y-6">
              {/* Upload Image */}
              <div>
                <label className="block text-gray-700 font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData("image", e.target.files[0])}
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {currentPost.image && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Image:</p>
                    <a
                      href={`/storage/${currentPost.image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Image
                    </a>
                  </div>
                )}
              </div>
              {/* Upload Featured Image */}
              <div>
                <label className="block text-gray-700 font-medium">Upload Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData("featured_image", e.target.files[0])}
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {currentPost.featured_image && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Featured Image:</p>
                    <a
                      href={`/storage/${currentPost.featured_image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Featured Image
                    </a>
                  </div>
                )}
              </div>
              {/* Upload Attachment */}
              <div>
                <label className="block text-gray-700 font-medium">Upload Attachment</label>
                <input
                  type="file"
                  onChange={(e) => setData("attachment", e.target.files[0])}
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {currentPost.attachment && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Attachment:</p>
                    <a
                      href={`/storage/${currentPost.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons: Update and Cancel */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={processing}
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Update
            </button>
            <Link
              href={route("create-posts.index")}
              className="inline-block rounded-lg bg-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
