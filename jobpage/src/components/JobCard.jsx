export default function JobCard({ job }) {
  return (
    <li className="p-5 border rounded-lg shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-primary mb-1">{job.title}</h2>
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
