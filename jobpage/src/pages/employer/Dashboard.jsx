import React, { useEffect, useState } from "react";

export default function Dashboard({ logout }) {
  const [employer, setEmployer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employer_name: "",
    username: "",
  });

  useEffect(() => {
    try {
      const storedEmployer = JSON.parse(localStorage.getItem("user"));
      setEmployer(storedEmployer);
      setForm({
        employer_name: storedEmployer?.employer_name || "",
        username: storedEmployer?.username || "",
      });
    } catch {
      setEmployer(null);
    }
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    const employerId = employer?.id;
    if (!employerId) return alert("Employer ID not found.");

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/employers/${employerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setEmployer(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditing(false);
    } catch (err) {
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!employer) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-gray-400 text-xl">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
        <p className="mb-8">
          Track your applications, saved jobs, and account info below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="text-center">
                {/*
              <img
                src={user.profile_photo_url || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
                */}
              <h2 className="font-bold">
                {employer.employer_name}
              </h2>
              <p className="text-teal-700">@{employer.username || "yourusername"}</p>
            </div>
            <nav className="space-y-2 text-sm">
              <button className="block w-full text-left hover:text-[#14B8A6]">
                Dashboard
              </button>
              <button
                className="block w-full text-left hover:text-[#14B8A6]"
                onClick={handleEdit}
              >
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
            {/* Profile Section */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              {!editing ? (
                <div>
                  <div><b>Employer Name:</b> {employer.employer_name}</div>
                    {/*
                  <div><b>Full Name:</b> {(user.first_name || "") + " " + (user.last_name || "")}</div>
                  <div><b>Email:</b> {user.email || <span className="text-gray-400">Not set</span>}</div>
                  <div><b>About Me:</b> {user.about_me || <span className="text-gray-400">Not set</span>}</div>
                  <div><b>Location:</b> {user.location || <span className="text-gray-400">Not set</span>}</div>
                  <div>
                    <b>LinkedIn:</b>{" "}
                    {user.linkedin_url ? (
                      <a
                        href={user.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#14B8A6] underline"
                      >
                        {user.linkedin_url}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </div>
                    */}
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-2">
                  <input
                    name="employer_name"
                    value={form.employer_name}
                    onChange={handleChange}
                    placeholder="Employer Name"
                    className="border p-2 rounded w-full"
                    disabled={loading}
                    />  
                    {/*
                  <div className="flex gap-2">
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="border p-2 rounded w-1/2"
                      disabled={loading}
                    />
                    <input
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="border p-2 rounded w-1/2"
                      disabled={loading}
                    />
                  </div>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border p-2 rounded w-full"
                    disabled={loading}
                  />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border p-2 rounded w-full"
                    disabled={loading}
                  />
                  <input
                    name="linkedin_url"
                    value={form.linkedin_url}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="border p-2 rounded w-full"
                    disabled={loading}
                  />
                  <input
                    name="profile_photo_url"
                    value={form.profile_photo_url}
                    onChange={handleChange}
                    placeholder="Profile Photo URL"
                    className="border p-2 rounded w-full"
                    disabled={loading}
                  />
                  <textarea
                    name="about_me"
                    value={form.about_me}
                    onChange={handleChange}
                    placeholder="About Me"
                    className="border p-2 rounded w-full"
                    disabled={loading}
                  />
                    */}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-[#14B8A6] text-white px-4 py-2 rounded hover:bg-teal-600"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
            {/* Applications & Saved Jobs - keep as before */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Your Applications</h3>
              <p className="text-sm text-gray-600">No applications to display yet.</p>
            </section>
            <section>
              <h3 className="text-lg font-semibold mb-2">Saved Jobs</h3>
              <p className="text-sm text-gray-600">You haven't saved any jobs yet.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

