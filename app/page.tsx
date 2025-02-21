"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TwitterThreadGenerator() {
  const [blogText, setBlogText] = useState("");
  const [thread, setThread] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateThread = async () => {
    if (!blogText.trim()) return;

    setLoading(true);
    setError(""); // Reset previous errors

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-thread`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blog_text: blogText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate thread");
      }

      setThread(data.thread);
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">🚀 Twitter Thread Generator</h1>
        
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Paste your blog or script here..."
          value={blogText}
          onChange={(e) => setBlogText(e.target.value)}
        />

        <button
          onClick={generateThread}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Thread"}
        </button>

        {error && (
          <p className="text-red-400 mt-2">{error}</p>
        )}

        {thread.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">📜 Generated Thread:</h2>
            {thread.map((tweet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700 p-3 rounded-lg my-2 shadow-md"
              >
                {tweet}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
