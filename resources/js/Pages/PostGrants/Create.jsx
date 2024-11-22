import React from "react";
import { useForm } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    image: null,
    post_status: "draft",
    grant_status: "open",
    category: "",
    tags: "",
    sponsored_by: "",
    location: "",
    email: "",
    contact_number: "",
    purpose: "find_pgstudent",
    start_date: "",
    end_date: "",
    budget: "",
    eligibility_criteria: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route("post-grants.store"));
  }

  return (
    <MainLayout title="Add New Grant">
      <div className="p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg max-w-lg mx-auto space-y-6 shadow-lg"
        >
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Add New Grant
          </h1>

          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter grant title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter description"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium">Image</label>
            <input
              type="file"
              onChange={(e) => setData("image", e.target.files[0])}
              className="w-full rounded-lg border-gray-200 p-2 text-sm"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          {/* Post Status */}
          <div>
            <label className="block text-gray-700 font-medium">Post Status</label>
            <select
              value={data.post_status}
              onChange={(e) => setData("post_status", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Grant Status */}
          <div>
            <label className="block text-gray-700 font-medium">
              Grant Status
            </label>
            <select
              value={data.grant_status}
              onChange={(e) => setData("grant_status", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                End Date
              </label>
              <input
                type="date"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-gray-700 font-medium">Budget</label>
            <input
              type="number"
              value={data.budget}
              onChange={(e) => setData("budget", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter budget (e.g., 5000.00)"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <input
              type="text"
              value={data.category}
              onChange={(e) => setData("category", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter category"
            />
          </div>

          {/* Sponsored By */}
          <div>
            <label className="block text-gray-700 font-medium">
              Sponsored By
            </label>
            <input
              type="text"
              value={data.sponsored_by}
              onChange={(e) => setData("sponsored_by", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter sponsor"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-gray-700 font-medium">Purpose</label>
            <select
              value={data.purpose}
              onChange={(e) => setData("purpose", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="find_pgstudent">Find Postgraduate Student</option>
              <option value="find_collaboration">Find Collaboration</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => setData("location", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter location"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter email"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700 font-medium">
              Contact Number
            </label>
            <input
              type="text"
              value={data.contact_number}
              onChange={(e) => setData("contact_number", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter contact number"
            />
          </div>

          {/* Eligibility Criteria */}
          <div>
            <label className="block text-gray-700 font-medium">
              Eligibility Criteria
            </label>
            <textarea
              value={data.eligibility_criteria}
              onChange={(e) => setData("eligibility_criteria", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter eligibility criteria"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-block rounded-lg bg-gray-200 px-5 py-3 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
