import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function NewListing() {
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        location: "",
        type: "",
        experience: "",
        salary: "",
        description: ""
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const employer = JSON.parse(localStorage.getItem("user"));
        if (!employer?.id) return alert("Employer ID not found.");
    
        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:8000/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, employer_id: employer.id }),
            });
            if (!res.ok) throw new Error("Failed to post job listing");
            await res.json();
            navigate("/employer/listings");
        } catch (err) {
            alert("Error posting job listing.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-2">New Job Listing</h3>
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
                        onClick={() => navigate("/employer/listings")}
                        className="bg-[#14B8A6] text-white px-4 py-2 rounded hover:bg-teal-600"
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="bg-[#14B8A6] text-white px-4 py-2 rounded hover:bg-teal-600"
                        disabled={submitting}
                    >
                        {submitting ? "Posting..." : "Post Job"}
                    </button>
                </div>
            </form>
        </div>
    );
}