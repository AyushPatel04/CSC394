import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import JbwButton from "../components/buttons";

export default function Login({ setToken }) {
  const nav = useNavigate();

  const [user, setUser] = useState("");
  const [pw,   setPw]   = useState("");
  const [err,  setErr]  = useState(null);

  const submit = e => {
    e.preventDefault();

    const body = new URLSearchParams();
    body.append("username", user);
    body.append("password", pw);
    body.append("grant_type", "password");

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        localStorage.setItem("token", d.access_token);
        setToken(d.access_token);
        nav("/");
      })
      .catch(() => setErr("Invalid credentials"));
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-primary">Log in</h1>

      {err && <p className="text-red-600">{err}</p>}

      <form onSubmit={submit} className="space-y-4">
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded-md"
          required
        />
        <JbwButton className="w-full">Log in</JbwButton>
      </form>

      <p className="mt-4 text-center text-sm">
        No account?{" "}
        <Link to="/signup" className="underline text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
