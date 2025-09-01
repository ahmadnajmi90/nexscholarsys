import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useRoles from "../../Hooks/useRoles";
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
        <div
          key={index}
          className="bg-blue-200 text-blue-800 rounded-full px-3 py-1 m-1 flex items-center"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-2 text-sm text-blue-800"
          >
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

export default function Create() {
  const { auth } = usePage().props;
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    // URL is auto-generated on the backend so it's not input by the user.
    url: "",
    content: "",
    category: "",
    tags: [],
    images: [],
    featured_image: null,
    attachment: null,
    status: "published",
  });

  // Update tags helper
  const setTags = (newTags) => {
    setData("tags", newTags);
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

    post(route("create-posts.store"), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      preserveScroll: true,
      onSuccess: () => {
        alert("Post created successfully.");
      },
      onError: (errors) => {
        console.error("Error creating Post:", errors);
        alert("Failed to create the Post. Please check the form for errors.");
      },
    });
  }

  return (
    <MainLayout title="">
      <Head title="Add New Post" />
      <div className="p-4">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 lg:p-0 rounded-lg max-w-7xl mx-auto space-y-6"
        >
          <h1 className="text-xl font-bold text-gray-700 text-center">
            Add New Post
          </h1>

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

          {/* Second Row: Content and Right Column for Tags, Image, Featured Image, Attachment */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8">
            {/* Left Column: Content Editor */}
            <div className="lg:col-span-7">
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

            {/* Right Column: Stack for Tags, Image, Featured Image, Attachment */}
            <div className="lg:col-span-3 flex flex-col space-y-4 lg:space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-gray-700 font-medium">Tags</label>
                <TagInput tags={data.tags} setTags={setTags} />
                {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
              </div>

              {/* Upload Images */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Upload Images (Multiple Allowed)
                </label>
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
                <label className="block text-gray-700 font-medium">
                  Upload Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData("featured_image", e.target.files[0])}
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {errors.featured_image && <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>}
              </div>

              {/* Upload Attachment */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Upload Attachment
                </label>
                <input
                  type="file"
                  onChange={(e) => setData("attachment", e.target.files[0])}
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {errors.attachment && <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
            <button
              type="submit"
              disabled={processing}
              className="w-full sm:w-auto inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Publish
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
