import JbwButton from "./buttons";
import { Link } from "react-router-dom";

export default function NavBar({ token, onLogout }) {
  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          <span className="opacity-90">Jobber</span>
          <span className="opacity-75">Wobber</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="underline hover:text-gray-200 text-sm font-medium"
          >
            Search jobs
          </Link>

          {token ? (
            <JbwButton onClick={onLogout}>Log&nbsp;out</JbwButton>
          ) : (
            <>
              <Link
                to="/login"
                className="underline hover:text-gray-200 text-sm font-medium"
              >
                Log&nbsp;in
              </Link>
              <JbwButton
                as={Link}
                to="/signup"
                className="!px-3 !py-1.5 text-sm"
              >
                Sign&nbsp;up
              </JbwButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
