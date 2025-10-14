import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useRoles from "../../Hooks/useRoles";
import BackButton from '@/Components/BackButton'
import { Head } from '@inertiajs/react';

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
  const { auth, post: currentPost } = usePage().props;
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

  const { data, setData, post, processing, errors } = useForm({
    title: currentPost.title || "",
    url: currentPost.url || "",
    content: currentPost.content || "",
    category: currentPost.category || "",
    tags: (() => {
      try {
        return currentPost.tags ? JSON.parse(currentPost.tags) : [];
      } catch (error) {
        console.warn('Failed to parse tags JSON:', error);
        return [];
      }
    })(),
    // New multiple images field. (We do not prefill this with existing images.)
    images: null,
    featured_image: null,
    attachment: null,
    status: currentPost.status || "published",
  });

  // For handling tags.
  const setTags = (newTags) => {
    setData("tags", newTags);
  };

  // State for images to delete
  const [deleteImages, setDeleteImages] = useState([]);

  const toggleDeleteImage = (imgPath) => {
    setDeleteImages((prev) => {
      const newState = prev.includes(imgPath)
        ? prev.filter((img) => img !== imgPath)
        : [...prev, imgPath];
      console.log("deleteImages state:", newState);
      return newState;
    });
  };
  
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
  
    Object.keys(data).forEach((key) => {
      if (key === "tags") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === "images" && Array.isArray(data[key])) {
        // Handle multiple images
        data[key].forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      } else if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
  
    // Append each deletion value using the "delete_images[]" key
    deleteImages.forEach((img) => {
      formData.append("delete_images[]", img);
    });
    
    post(route("create-posts.update", currentPost.id), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      preserveScroll: true,
      onSuccess: () => {
        alert("Post updated successfully.");
      },
      onError: (errors) => {
        console.error("Error updating Post:", errors);
        alert("Failed to update the Post. Please check the form for errors.");
      },
    });
  }

  return (
    <MainLayout>
      <Head title="Edit Post" />
      <div className="p-4">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-0 rounded-lg max-w-7xl mx-auto space-y-6">
          <h1 className="text-xl font-bold text-gray-700 text-center">Edit Post</h1>

          {/* Display any general errors at the top */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Please fix the following errors:</strong>
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(errors).map(([key, value]) => (
                  <li key={key}>
                    {key === 'images' ? 
                      Object.entries(value).map(([imgKey, imgValue]) => (
                        <span key={imgKey}>Image {parseInt(imgKey) + 1}: {imgValue}</span>
                      ))
                      : value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* First Row: Title and Category */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8">
            <div className="lg:col-span-7">
              <label className="block text-gray-700 font-medium">
                Post Title <span className="text-red-600">*</span>
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
            <div className="lg:col-span-3">
              <label className="block text-gray-700 font-medium">Category <span className="text-red-600">*</span></label>
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
                <option value="News">News</option>
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Research Methodology">Research Methodology</option>
                <option value="Research Paradigm">Research Paradigm</option>
                <option value="Science & Technology">Science & Technology</option>
                <option value="Social Science">Social Science</option>
                <option value="Community">Community</option>
                <option value="Award">Award</option>
                <option value="Achievement">Achievement</option>
                <option value="Business">Business</option>
                <option value="Economy">Economy</option>
                <option value="Health">Health</option>
                <option value="Science">Science</option>
                <option value="Sport">Sport</option>
                <option value="Corporate Social Responsibility">Corporate Social Responsibility</option>
                <option value="Knowledge Transfer Program">Knowledge Transfer Program</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Second Row: URL (disabled) and Tags */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8">
            <div className="lg:col-span-7">
              <label className="block text-gray-700 font-medium">Post URL</label>
              <input
                type="url"
                value={data.url}
                disabled
                onChange={(e) => setData("url", e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-200 p-4 bg-gray-100 text-sm cursor-not-allowed"
                placeholder="Auto-generated from title"
              />
              {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
            </div>
            <div className="lg:col-span-3">
              <label className="block text-gray-700 font-medium">Tags</label>
              <TagInput tags={data.tags} setTags={setTags} />
              {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
            </div>
          </div>

          {/* Third Row: Content and File Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8">
            <div className="lg:col-span-7">
              <label className="block text-gray-700 font-medium">
                Content <span className="text-red-600">*</span>
              </label>
              <div className="mt-1 w-full rounded-lg border border-gray-200" style={{ height: "300px", overflowY: "auto" }}>
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

            {/* Right Column: File Uploads */}
            <div className="lg:col-span-3 flex flex-col space-y-4 lg:space-y-6">
              {/* Upload Images (multiple) */}
              <div>
                <label className="block text-gray-700 font-medium">Upload Images (Multiple Allowed)</label>
                <p className="text-sm text-gray-500">(Upload new images will delete all existed images)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setData("images", files);
                  }}
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {currentPost.images && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Images:</p> 
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(currentPost.images).map((img, index) => (
                        <a
                          key={index}
                          href={`/storage/${img}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Image {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {errors.images && (
                  <div className="mt-1">
                    {Object.entries(errors.images).map(([key, value]) => (
                      <p key={key} className="text-red-500 text-xs">
                        Image {parseInt(key) + 1}: {value}
                      </p>
                    ))}
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
                {errors.featured_image && <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>}
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
                {errors.attachment && <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
            <button
              type="submit"
              disabled={processing}
              className="w-full sm:w-auto inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Update
            </button>
            <Link
              href={route("create-posts.index")}
              className="w-full sm:w-auto inline-block rounded-lg bg-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-400 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
