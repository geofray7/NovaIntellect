// src/components/MoodSelector.tsx

const MoodSelector = ({
  mood,
  setMood,
}: {
  mood: string;
  setMood: (mood: string) => void;
}) => {
  const moods = ["Default", "Friendly", "Professional", "Casual"];

  return (
    <div className="bg-[#1c1c1c] px-6 py-3 flex space-x-3 items-center border-b border-gray-800">
      <span className="text-sm text-gray-400">Mood:</span>
      {moods.map((m) => (
        <button
          key={m}
          onClick={() => setMood(m)}
          className={`px-3 py-1 text-sm rounded-full ${
            m === mood
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300"
          } hover:bg-purple-500 transition`}
        >
          {m}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
