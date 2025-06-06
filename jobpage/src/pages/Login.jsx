import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import JbwButton from "../components/buttons";

export default function Login({ setToken, setUser }) {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const submit = (e) => {
    e.preventDefault();

    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);
    body.append("grant_type", "password");

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        // Confirm structure before storing
        if (!data.access_token || !data.user || !data.user.id) throw new Error("Malformed response");

        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.access_token);
        setUser(data.user);

        //nav("/dashboard");
        if (data.user.role === "employer") {
          nav("/employer/dashboard");
        } else if (data.user.role === "user") {
          nav("/user/dashboard");
        } else {            
          nav("/");
        }
      })
      .catch((e) => {
        console.error("Login error:", e);
        setErr("Invalid credentials or server error");
      });
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-primary">Log in</h1>

      {err && <p className="text-red-600">{err}</p>}

      <form onSubmit={submit} className="space-y-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded-md"
          required
        />
        <JbwButton className="w-full">Log in</JbwButton>
      </form>

      {/*}
      <p className="mt-4 text-center text-sm">
        <Link to="/reset" className="underline text-primary">
          Forgot username or password?
        </Link>
      </p>
      */}

      <p className="mt-4 text-center text-sm">
        No account?{" "}
        <Link to="/signup" className="underline text-primary">
          Sign up
        </Link>
      </p>

      <p className="mt-4 text-center text-sm">
        Back to{" "}
        <Link to="/welcome" className="underline text-primary">
          Home
        </Link>
      </p>
    </div>
  );
}

