import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewListing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/listings")
      .then(res => res.json())
      .then(data => {
        const match = data.listings.find(l => l.id.toString() === id);
        setListing(match);
      });
  }, [id]);

  if (!listing) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-gray-400 text-xl">Loading job listing...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded text-[#0F172A]">
      <h2 className="text-2xl font-bold mb-4">{listing.title}</h2>
      <div className="space-y-2">
        <p><strong>Location:</strong> {listing.location}</p>
        <p><strong>Type:</strong> {listing.type}</p>
        <p><strong>Experience:</strong> {listing.experience}</p>
        <p><strong>Salary:</strong> {listing.salary}</p>
      </div>
    </div>
  );
}
