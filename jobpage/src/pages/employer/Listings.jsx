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

    const handleDelete = async listingId => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return;

        try {
            const res = await fetch(`http://localhost:8000/listings/${listingId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete job listing");
            setListings((prev) => prev.filter((listing) => listing.id !== listingId));
        } catch (err) {
            alert("Error deleting job listing.");
        }
    };

    if (loading) return <div>Loading your job listings...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Posted Job Listings</h1>
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={() => navigate("/newlisting")}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            New Job Listing
                        </button>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Dashboard
                        </button>
                    </div>
                </div>

            <p className="mb-8">
            View your posted job listings below.
            </p>

            <div className="md:col-span-4 bg-white rounded-lg shadow p-6 space-y-6">
            {listings.length === 0 ? (
                <p>No listings found.</p>
            ) : (
                <ul className="space-y-4">
                    {listings.map((listing) => (
                        <li key={listing.id} className="border p-4 rounded shadow flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold">{listing.title}</h3>
                                <p><strong>Location:</strong> {listing.location}</p>
                                <p><strong>Type:</strong> {listing.type}</p>
                                <p><strong>Experience:</strong> {listing.experience}</p>
                                <p><strong>Salary:</strong> {listing.salary}</p>
                                <p><strong>Description:</strong> {listing.description}</p>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/editlisting/${listing.id}`)}
                                    className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(listing.id)}
                                    className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            </div>
            </div>
        </div>
    );
}