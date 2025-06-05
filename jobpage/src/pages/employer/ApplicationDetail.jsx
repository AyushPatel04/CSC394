import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ApplicationDetail() {
  const { id }   = useParams();                
  const [data,setData]   = useState(null);
  const [status,setStatus]=useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/application/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setStatus(d.application.status); })
      .catch(() => alert("Could not load application"));
  }, [id]);

  const saveStatus = () => {
    fetch(`http://localhost:8000/application/${id}/status`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status })
    })
      .then(r=>r.json())
      .then(() => alert("Status updated"))
      .catch(()=>alert("Error updating status"));
  };

  if (!data) return null;

  const { listing, applicant } = data;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-blue-600 text-white px-4 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Application #{id} – {listing.title}
      </h1>

      <h2 className="font-semibold mb-2">Applicant info</h2>
      <ul className="mb-6 list-disc pl-6">
        {Object.entries(applicant).map(
          ([k,v]) => v && <li key={k}><b>{k.replace("_"," ")}:</b> {v}</li>
        )}
      </ul>

      <label className="block mb-2 font-semibold">Status</label>
      <select
        value={status}
        onChange={e=>setStatus(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option>Submitted</option>
        <option>In review</option>
        <option>Interview</option>
        <option>Rejected</option>
        <option>Accepted</option>
      </select>

      <button
        onClick={saveStatus}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save
      </button>
    </div>
  );
}
