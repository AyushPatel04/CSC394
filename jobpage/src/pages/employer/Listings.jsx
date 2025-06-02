import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const employer = JSON.parse(localStorage.getItem("user"));
        const employerId = employer?.id;
        if (!employer?.id) return alert("Employer ID not found.");

        fetch(`http://localhost:8000/employers/${employerId}/listings`)
            .then ((res) => res.json())
            .then((data) => {
                setListings(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load employer's listings:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading your job listings...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Job Listings</h2>
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
                
                <button
                    type="button"
                    onClick={() => navigate("/employer/listings/new")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Job Listing
                </button>
            </div>
            {listings.length === 0 ? (
                <p>No listings found.</p>
            ) : (
                <ul className="space-y-4">
                    {listings.map((listing) => (
                        <li key={listing.id} className="border p-4 rounded shadow">
                            <h3 className="text-lg font-semibold">{listing.title}</h3>
                            <p><strong>Location:</strong> {listing.location}</p>
                            <p><strong>Type:</strong> {listing.type}</p>
                            <p><strong>Experience:</strong> {listing.experience}</p>
                            <p><strong>Salary:</strong> {listing.salary}</p>
                            <p><strong>Description:</strong> {listing.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}