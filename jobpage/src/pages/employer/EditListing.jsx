import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function EditListing() {
    const { listingId } = useParams();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        location: "",
        type: "",
        experience: "",
        salary: "",
        description: ""
    });

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch(`http://localhost:8000/listings/${listingId}`);
                if (!res.ok) throw new Error("Failed to fetch job listing");
                const data = await res.json();
                setForm({
                    title: data.title || "",
                    location: data.location || "",
                    type: data.type || "",
                    experience: data.experience || "",
                    salary: data.salary || "",
                    description: data.description || ""
                });
            } catch (err) {
                alert("Error loading job listing.");
                navigate("/listings");
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [listingId, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`http://localhost:8000/listings/${listingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( form ),
            });
            if (!res.ok) throw new Error("Failed to update job listing");
            await res.json();
            navigate("/listings");
        } catch (err) {
            alert("Error updating job listing.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading your job listing...</div>;

    return (
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-2">Edit Job Listing</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Job Type"
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Experience Required"
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="Salary"
                    className="border p-2 rounded w-full"
                    required
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Job Description"
                    className="border p-2 rounded w-full"
                    rows={20}
                    required
                />
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/listings")}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={submitting}
                    >
                        {submitting ? "Updating..." : "Update Job Listing"}
                    </button>
                </div>
            </form>
        </div>
    );
}