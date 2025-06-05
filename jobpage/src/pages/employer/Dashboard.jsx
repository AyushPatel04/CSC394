import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Dashboard({ logout }) {
  const [employer, setEmployer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employer_name: "",
    username: "",
  });

  const navigate = useNavigate();

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
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
          Manage your job listings, received applications, and account information below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="text-center">
              <h2 className="font-bold">{employer.employer_name}</h2>
              <p className="text-blue-600">@{employer.username || "yourusername"}</p>
              <button
                className="mt-3 text-sm text-blue-600"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>

            <nav className="space-y-2 text-sm">
              <button
                className="block w-full text-left hover:text-blue-600"
                onClick={() => navigate("/listings")}
              >
                Job Listings
              </button>
              <button
                className="block w-full text-left hover:text-blue-600"
                onClick={() => navigate("/employer/applications")}
              >
                Applications
              </button>
              <button
                className="block w-full text-left hover:text-blue-600"
                onClick={() => navigate("/reset")}
              >
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

          <div className="md:col-span-2 bg-white rounded-lg shadow p-6 space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              {!editing ? (
                <div>
                  <div><b>Employer Name:</b> {employer.employer_name}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
