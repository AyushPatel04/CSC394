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
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Posted Jobs</h2>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => navigate("/newlisting")}
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
                                    //onClick={() => }
                                    className="bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}