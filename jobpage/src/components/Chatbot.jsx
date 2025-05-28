import { useState, useRef, useEffect } from "react";
import JbwButton from "./buttons";

export default function Chatbot({ lastSearch }) {
  const [open, setOpen]     = useState(false);
  const [input, setInput]   = useState("");
  const [history, setHist]  = useState([]); 
  const bottomRef = useRef(null);

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, open]);

  const send = () => {
    if (!input.trim()) return;
    const newHist = [...history, { role: "user", content: input }];
    setHist(newHist);
    setInput("");

    fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: newHist, last_search: lastSearch }),
    })
      .then(r => r.json())
      .then(d => {
        setHist(h => [...h, { role: "assistant", content: d.reply }]);
      })
      .catch(() =>
        setHist(h => [
          ...h,
          { role: "assistant", content: "Sorry, I had a problem answering." },
        ])
      );
  };

  return (
    <>
      {}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-primary text-white p-3 shadow-lg"
      >
        {open ? "×" : "💬"}
      </button>

      {}
      {open && (
        <div
          className="fixed bottom-16 right-4 w-72 h-96 bg-white border rounded-lg shadow-xl
                     flex flex-col z-40"
        >
          <div className="p-2 text-center font-semibold bg-primary text-white rounded-t-lg">
            JobberWobber Chat
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
            {history.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "user"
                    ? "text-right"
                    : "text-left text-primary"
                }
              >
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              send();
            }}
            className="p-2 border-t flex gap-1"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-grow border rounded-md p-1 text-sm"
              placeholder="Ask me..."
            />
            <JbwButton className="!px-3 !py-1 text-sm">↩</JbwButton>
          </form>
        </div>
      )}
    </>
  );
}
