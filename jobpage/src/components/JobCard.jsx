export default function JobCard({ job }) {
  function getDaysAgo(pubDate) {
    const postedDate = new Date(pubDate);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Posted today" : `Posted ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  return (
    <li className="p-5 border rounded-lg shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-primary mb-1">{job.title}</h2>

      {job.publication_date && (
        <p className="text-xs text-gray-500 italic mb-2">
          {getDaysAgo(job.publication_date)}
        </p>
      )}

      <div className="mb-2">
        {job.type && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            {job.type}
          </span>
        )}
        {job.experience && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {job.experience}
          </span>
        )}
      </div>

      {job.company && <p className="text-gray-600">{job.company}</p>}
      {job.location && <p>{job.location}</p>}
      {job.salary && <p>{job.salary}</p>}

      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 text-primary underline hover:text-primaryHover"
        >
          View posting →
        </a>
      )}
    </li>
  );
}
