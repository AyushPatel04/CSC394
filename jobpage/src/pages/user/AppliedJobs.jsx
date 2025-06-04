import React from "react";
import { useNavigate } from "react-router-dom";

export default function AppliedJobs() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Applied Jobs</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
      <p className="text-gray-600">You have not applied to any jobs yet.</p>
    </div>
  );
}
