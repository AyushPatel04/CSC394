import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import JbwButton from "../components/buttons";

export default function Signup({ setToken }) {
  const nav = useNavigate();

  const [user, setUser] = useState("");
  const [pw,   setPw]   = useState("");
  const [err,  setErr]  = useState(null);

  const submit = e => {
    e.preventDefault();

    fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pw })
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        localStorage.setItem("token", d.access_token);
        setToken(d.access_token);
        nav("/");
      })
      .catch(() => setErr("Username already taken"));
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-primary">Sign up</h1>

      {err && <p className="text-red-600">{err}</p>}

      <form onSubmit={submit} className="space-y-4">
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="Choose a username"
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
        <JbwButton className="w-full">Create account</JbwButton>
      </form>

      <p className="mt-4 text-center text-sm">
        Have an account?{" "}
        <Link to="/login" className="underline text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
