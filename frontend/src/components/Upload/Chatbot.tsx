import { useState } from "react";
import { mockHistory } from "./MockHistory";
import ChatHistory from "./ChatHistory";

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(mockHistory);
  const [filteredHistory, setFilteredHistory] = useState(mockHistory);
  const [sqlType, setSqlType] = useState("MySQL");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: history.length + 1,
        type: sqlType,
        question: message,
        answer: "This is a placeholder answer for: " + message,
      };
      setHistory((prev) => [...prev, newMessage]);
      setFilteredHistory((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilteredHistory(
      history.filter(
        (msg) =>
          msg.question.toLowerCase().includes(query) ||
          msg.answer.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="flex" style={{ height: `calc(100vh - 80px)` }}>
      <div className="w-1/4 p-4 border-r border-gray-300">
        <input
          type="text"
          placeholder="Search history..."
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <h3 className="font-bold mt-4">History</h3>
        <div
          className="overflow-y-auto"
          style={{ height: `calc(100vh - 200px)` }}
        >
          <ChatHistory history={filteredHistory} />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              onClick={() => setSqlType("MySQL")}
              className={`mr-2 ${sqlType === "MySQL" ? "font-bold" : ""}`}
            >
              MySQL
            </button>
            <button
              onClick={() => setSqlType("PostgreSQL")}
              className={`mr-2 ${sqlType === "PostgreSQL" ? "font-bold" : ""}`}
            >
              PostgreSQL
            </button>
            <button
              onClick={() => setSqlType("SQLite")}
              className={`mr-2 ${sqlType === "SQLite" ? "font-bold" : ""}`}
            >
              SQLite
            </button>
          </div>
          <h2 className="text-lg">SQL Type: {sqlType}</h2>
        </div>

        {/* The scrollable chat area */}
        <div className="flex-grow overflow-y-auto border border-gray-300 p-4 mb-4">
          {/* Chat content goes here */}
        </div>

        {/* The form for sending messages */}
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white p-2 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
