import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar     from "../components/NavBar";
import JbwButton  from "../components/buttons";      
import JobCard    from "../components/JobCard";

export default function Home({ token, logout, onSearch }) {   
  const nav = useNavigate();

  const [search, setSearch]  = useState("");
  const [jobs,   setJobs]    = useState([]);
  const [loading, setLoading]= useState(false);
  const [error,   setError]  = useState(null);

  const fetchJobs = q => {
    setLoading(true);
    setError(null);

    const url = q
      ? `/remote?q=${encodeURIComponent(q)}`
      : `/jobcard`;

    fetch("http://localhost:8000" + url)
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : d.listings ?? [];
        setJobs(arr);
      })
      .catch(() => setError("Server error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(""); }, []);

  return (
    <>
      <NavBar token={token} onLogout={logout} />

      <main className="max-w-4xl mx-auto p-6">
        <form
          onSubmit={e => {
            e.preventDefault();
            const q = search.trim();
            onSearch?.(q);          
            fetchJobs(q);
          }}
          className="flex gap-2 mb-8"
        >
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by job title…"
            className="flex-grow p-3 border rounded-md focus:outline-primary/70"
          />
          <JbwButton>Search</JbwButton>
        </form>

        {loading && <p>Loading…</p>}
        {error   && <p className="text-red-600">{error}</p>}
        {!loading && !error && jobs.length === 0 && <p>No listings found.</p>}

        <ul className="space-y-4">
          {jobs.map((j, idx) => (
            <JobCard key={j.id ?? j.url ?? idx} job={j} />
          ))}
        </ul>
      </main>
    </>
  );
}
