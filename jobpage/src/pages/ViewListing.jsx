import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewListing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/jobcard")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((l) => l.id.toString() === id);
        if (!match) {
          alert("Job listing not found");
          navigate("/home");
          return;
        }
        setListing(match);
      })
      .catch(() => {
        alert("Error fetching job listing");
        navigate("/home");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Please log in to apply for this job.");
      return;
    }

    const application = {
      user_id: user.id,
      employer_id: listing.employer_id,
      job_listing_id: listing.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      linkedin_url: user.linkedin_url,
      experience: user.experience,
      skills: user.skills,
      education: user.education,
      summary: user.summary,
      other: user.other
    };

    try {
      const res = await fetch("http://localhost:8000/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(application),
      });

      if (res.status === 409) {
        const data = await res.json();
        alert(data.detail); // "You have already applied to this job."
      } else if (!res.ok) {
        throw new Error("Failed to apply.");
      } else {
        alert("Application submitted successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting application.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-gray-400 text-xl">Loading job listing...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-gray-400 text-xl">Job listing not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded text-[#0F172A]">
      <h2 className="text-2xl font-bold mb-4">{listing.title}</h2>
      <div className="space-y-2">
        <p><strong>Company:</strong> {listing.company}</p>
        <p><strong>Location:</strong> {listing.location}</p>
        <p><strong>Type:</strong> {listing.type}</p>
        <p><strong>Experience:</strong> {listing.experience}</p>
        <p><strong>Salary:</strong> {listing.salary}</p>
        <p><strong>Description:</strong> {listing.description}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={handleApply}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={() => navigate(`/home`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Listings
        </button>
      </div>
    </div>
  );
}

