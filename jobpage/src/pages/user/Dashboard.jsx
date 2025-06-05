import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ logout, showProfileEditor }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    about_me: "",
    location: "",
    linkedin_url: "",
    profile_photo_url: ""
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      setForm({
        first_name: storedUser?.first_name || "",
        last_name: storedUser?.last_name || "",
        email: storedUser?.email || "",
        about_me: storedUser?.about_me || "",
        location: storedUser?.location || "",
        linkedin_url: storedUser?.linkedin_url || "",
        profile_photo_url: storedUser?.profile_photo_url || ""
      });
    } catch {
      setUser(null);
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    const userId = user?.id;
    if (!userId) return alert("User ID not found.");

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      navigate("/dashboard");
    } catch (err) {
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-gray-400 text-xl">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
          <div className="space-x-2">
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Home
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
        </div>

        <p className="mb-8">
          Track your applications and manage account information below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="text-center">
              <img
                src={user.profile_photo_url || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h2 className="font-bold">{`${user.first_name || ""} ${user.last_name || ""}`}</h2>
              <p className="text-blue-600">@{user.username}</p>

              <button
                className="mt-3 text-sm text-blue-600"
                onClick={() => navigate("/dashboard/profile")}
              >
                Edit Profile
              </button>
            </div>

            <nav className="space-y-2 text-sm mt-6">
              {/*}
              <button className="block w-full text-left hover:text-[#14B8A6]" onClick={() => navigate("/")}>
                Home
              </button>
              */}
              <button className="block w-full text-left hover:text-blue-600" onClick={() => navigate("/dashboard/resume")}>
                Resume
              </button>
              <button className="block w-full text-left hover:text-blue-600" onClick={() => navigate("/dashboard/applied")}>
                Applications
              </button>
              <button className="block w-full text-left hover:text-blue-600" onClick={() => navigate("/reset")}>
                Reset Password
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
            {showProfileEditor ? (
              <section>
                <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
                <form onSubmit={handleSave} className="space-y-2">
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
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
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
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            ) : (
              <>
              {/*}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Your Applications</h3>
                  <p className="text-sm text-gray-600">No applications to display yet.</p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold mb-2">Saved Jobs</h3>
                  <p className="text-sm text-gray-600">You haven't saved any jobs yet.</p>
                </section>
                */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Profile</h3>
                  <div><b>Full Name:</b> {(user.first_name || "") + " " + (user.last_name || "")}</div>
                  <div><b>Email:</b> {user.email || <span className="text-gray-400">None</span>}</div>
                  <div><b>Phone:</b> {user.phone || <span className="text-gray-400">None</span>}</div>
                  <div><b>Location:</b> {user.location || <span className="text-gray-400">None</span>}</div>
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
                      <span className="text-gray-400">None</span>
                    )}
                  </div>
                  <div><b>About Me:</b> {user.about_me || <span className="text-gray-400">None</span>}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
