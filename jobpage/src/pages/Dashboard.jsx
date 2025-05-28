import React, { useEffect, useState } from "react";

export default function Dashboard({ logout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Welcome to your Dashboard
        </h1>
        <p className="mb-8">
          Track your applications, saved jobs, and account info below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h2 className="font-bold">
                {user?.name || "Your Name"}
              </h2>
              <p className="text-teal-700">
                @{user?.username || "yourusername"}
              </p>
            </div>
            <nav className="space-y-2 text-sm">
              <button className="block w-full text-left hover:text-[#14B8A6]">
                Dashboard
              </button>
              <button className="block w-full text-left hover:text-[#14B8A6]">
                Edit Profile
              </button>
              <button className="block w-full text-left hover:text-[#14B8A6]">
                Applied Jobs
              </button>
              <button className="block w-full text-left hover:text-[#14B8A6]">
                Saved Jobs
              </button>
              <button
                onClick={logout}
                className="block w-full text-left text-red-600 hover:underline"
              >
                Log Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6 space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Your Applications
              </h3>
              <p className="text-sm text-gray-600">
                No applications to display yet.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Saved Jobs</h3>
              <p className="text-sm text-gray-600">
                You haven't saved any jobs yet.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

