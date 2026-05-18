"use client";

import { useState, useEffect } from "react";

const avatars = ["🧙", "🧝‍♂️", "🧛", "🧞‍♂️", "🧑‍🚀", "🦸"];

export default function Home() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [history, setHistory] = useState<string[]>([]);

  const [name, setName] = useState("Hero");
  const [avatar, setAvatar] = useState("🧙");

  const [streak, setStreak] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [dailyQuest, setDailyQuest] = useState("Do 20 pushups 💪");

  // LOAD
  useEffect(() => {
    const savedXp = localStorage.getItem("xp");
    const savedLevel = localStorage.getItem("level");
    const savedHistory = localStorage.getItem("history");
    const savedName = localStorage.getItem("name");
    const savedAvatar = localStorage.getItem("avatar");

    if (savedXp) setXp(Number(savedXp));
    if (savedLevel) setLevel(Number(savedLevel));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedName) setName(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("xp", xp.toString());
    localStorage.setItem("level", level.toString());
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("name", name);
    localStorage.setItem("avatar", avatar);
  }, [xp, level, history, name, avatar]);

  function completeQuest() {
    const newXp = xp + 100;
    setXp(newXp);
    setHistory([result, ...history]);

    // Achievements
    let updated = [...achievements];

    if (newXp >= 100 && !updated.includes("First Quest 🎉")) {
      updated.push("First Quest 🎉");
    }
    if (newXp >= 300 && !updated.includes("Rising Hero ⚔️")) {
      updated.push("Rising Hero ⚔️");
    }
    if (newXp >= 500 && !updated.includes("Legend 🔥")) {
      updated.push("Legend 🔥");
    }

    setAchievements(updated);

    if (newXp >= level * 200) {
      setLevel(level + 1);
    }
  }

  async function generateQuest() {
    try {
      const res = await fetch("/api/quest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      });

      const data = await res.json();

      // fallback so UI always works
      setResult(data.result || "⚠️ No response (check backend)");
    } catch (err) {
      setResult("❌ Error generating quest");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white flex flex-col items-center p-4">

      {/* HEADER */}
      <div className="w-full max-w-3xl bg-zinc-900 rounded-xl p-4 flex justify-between items-center shadow-lg mb-4 border border-purple-700">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{avatar}</div>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 px-2 rounded text-sm"
            />
            <p className="text-xs text-gray-400">
              Level {level} • XP {xp}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg">🔥 {streak}</p>
          <p className="text-xs text-gray-400">Streak</p>
        </div>
      </div>

      {/* AVATAR */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {avatars.map((a) => (
          <button
            key={a}
            onClick={() => setAvatar(a)}
            className={`text-2xl p-2 rounded ${
              avatar === a ? "bg-purple-600" : "bg-zinc-800"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl p-6 shadow-xl border border-purple-800">

        <h1 className="text-3xl text-center mb-6">
          ⚔️ {name}'s Quest
        </h1>

        {/* INPUT */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your mission..."
            className="flex-1 p-3 rounded bg-zinc-800"
          />

          <button
            onClick={generateQuest}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Generate
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="bg-zinc-800 p-4 rounded mb-4 border border-green-500">
            <p className="whitespace-pre-wrap">{result}</p>

            <button
              onClick={completeQuest}
              className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
            >
              Complete Quest ✅
            </button>
          </div>
        )}

        {/* DAILY */}
        <div className="bg-zinc-800 p-3 rounded mb-4 border border-purple-500">
          <p className="text-purple-400 font-semibold">📅 Daily Quest</p>
          <p className="text-sm">{dailyQuest}</p>
        </div>

        {/* ACHIEVEMENTS (IMPROVED) */}
        <div className="bg-zinc-800 p-4 rounded mb-4 border border-yellow-500">
          <p className="text-yellow-400 font-semibold mb-2">🏆 Achievements</p>

          {achievements.length === 0 && (
            <p className="text-sm text-gray-400">No achievements yet</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {achievements.map((a, i) => (
              <div
                key={i}
                className="bg-zinc-900 p-2 rounded text-center text-sm shadow"
              >
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* HISTORY */}
        <div className="bg-zinc-800 p-3 rounded border border-blue-500">
          <p className="text-blue-400 font-semibold">📜 Quest Log</p>
          {history.map((h, i) => (
            <p key={i} className="text-xs text-gray-400">
              {h.slice(0, 40)}...
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}