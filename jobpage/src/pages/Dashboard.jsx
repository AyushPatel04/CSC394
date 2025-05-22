import React from "react";

export default function Dashboard({ logout }) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="mb-2">Here you can track your applications, saved jobs, and account info.</p>
      
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log out
      </button>
    </div>
  );
}

