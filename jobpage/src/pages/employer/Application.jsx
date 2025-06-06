import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Application() {
  const [apps, setApps] = useState([]);
  const navigate        = useNavigate();
  const employer        = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!employer?.id) return;
    fetch(`http://localhost:8000/employers/${employer.id}/applications`)
      .then(r => r.json())
      .then(setApps)
      .catch(() => alert("Unable to load applications"));
  }, [employer?.id]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-[#0F172A]">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dashboard
        </button>
      </div>

      {apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table className="w-full border rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">App&nbsp;ID</th>
              <th className="p-3">Job Title</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.id}</td>
                <td className="p-3">{a.title}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3">
                  <Link
                    to={`/applications/${a.id}`}
                    className="text-blue-600 underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
