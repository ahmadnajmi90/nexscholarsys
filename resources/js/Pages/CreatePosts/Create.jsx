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
    image: null,
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
      } else if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    post(route("create-posts.store"), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert("Post created successfully.");
      },
      onError: (errors) => {
        console.error("Error creating Post:", errors);
        alert("Failed to create the Post. Please try again.");
      },
    });
  }

  return (
    <MainLayout title="">
      <div className="p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6"
        >
          <h1 className="text-xl font-bold text-gray-700 text-center">
            Add New Post
          </h1>

          {/* First Row: Title and Category */}
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
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
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
                <option value="Scholarships & Funding">
                  Scholarships & Funding
                </option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Second Row: Content and Right Column for Tags, Image, Featured Image, Attachment */}
          <div className="grid grid-cols-10 gap-8">
            {/* Left Column: Content Editor */}
            <div className="col-span-7">
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
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>

            {/* Right Column: Stack for Tags, Image, Featured Image, Attachment */}
            <div className="col-span-3 flex flex-col space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-gray-700 font-medium">Tags</label>
                <TagInput tags={data.tags} setTags={setTags} />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
                )}
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setData("image", e.target.files[0])
                  }
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
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
                  onChange={(e) =>
                    setData("featured_image", e.target.files[0])
                  }
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {errors.featured_image && (
                  <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>
                )}
              </div>

              {/* Upload Attachment */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Upload Attachment
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setData("attachment", e.target.files[0])
                  }
                  className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {errors.attachment && (
                  <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={processing}
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Publish
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
