import React, { useState } from "react";

const Reset = () => {
  const [mode, setMode] = useState("username"); // 'username' or 'password'
  const [input, setInput] = useState(""); // username or email
  const [newValue, setNewValue] = useState(""); // new password or new username

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = mode === "password" ? "/reset/password" : "/reset/username";
    const body =
      mode === "password"
        ? { username: input, new_password: newValue }
        : { email: input, new_username: newValue };

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unknown error");

      alert(data.message || "Reset successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border border-gray-300 rounded shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Reset {mode === "username" ? "Username" : "Password"}
      </h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            mode === "username" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("username")}
        >
          Forgot Username
        </button>
        <button
          className={`px-4 py-2 rounded ${
            mode === "password" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("password")}
        >
          Forgot Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-center">
        {mode && (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "password" ? "Enter your username" : "Enter your email"
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={
                mode === "password"
                  ? "Enter new password"
                  : "Enter new username"
              }
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded w-full"
            >
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Reset;

