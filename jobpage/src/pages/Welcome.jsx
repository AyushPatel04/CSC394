import { Link } from "react-router-dom";
import NavBar    from "../components/NavBar";
import JbwButton from "../components/buttons";

export default function Welcome({ token, setToken, logout }) {
  return (
    <>
      <NavBar token={token} onLogout={logout} />

      <main className="max-w-4xl mx-auto text-center p-10">
        <h1 className="text-4xl font-extrabold text-primary mb-4">
          Find your dream remote job.
        </h1>
        <p className="text-gray-700 mb-8">
          JobberWobber lets you search thousands of remote tech positions in
          seconds — no account required. Sign up to save your favorites and get
          personalized recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <JbwButton as={Link} to="/search" className="text-lg">
            Search jobs
          </JbwButton>

          {!token && (
            <Link
              to="/signup"
              className="text-lg underline text-primary hover:text-primaryHover flex items-center"
            >
              Create a free account →
            </Link>
          )}
        </div>

        {/* just grabbed a random image */}
        <img
        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=960&q=80"
        alt="People working remotely"
        className="rounded-lg shadow-lg mt-12 mx-auto"
/>
      </main>
    </>
  );
}
