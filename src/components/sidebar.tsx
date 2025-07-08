import React from "react";

interface Props {
  onNewChat: () => void;
  onLogout: () => void;
  onFeedback: () => void;
}

const Sidebar: React.FC<Props> = ({ onNewChat, onLogout, onFeedback }) => {
  return (
    <div className="w-64 bg-[#111111] text-white flex flex-col border-r border-[#ff004f]">
      <div className="p-6 border-b border-[#ff004f]">
        <h2 className="text-xl font-bold text-[#ff004f]">Menu</h2>
      </div>

      <div className="flex-1 px-4 py-2 space-y-2">
        <button
          onClick={onNewChat}
          className="w-full text-left px-4 py-2 bg-[#1f1f1f] hover:bg-[#ff004f] hover:text-white rounded transition duration-200"
        >
          📝 New Chat
        </button>

        <button
          onClick={onFeedback}
          className="w-full text-left px-4 py-2 bg-[#1f1f1f] hover:bg-[#ff004f] hover:text-white rounded transition duration-200"
        >
          💬 Feedback
        </button>

        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 bg-[#1f1f1f] hover:bg-red-700 hover:text-white rounded transition duration-200"
        >
          🚪 Logout
        </button>
      </div>

      <div className="p-4 text-xs text-gray-500 border-t border-[#ff004f]">
        <p>NovaIntellect © 2025</p>
      </div>
    </div>
  );
};

export default Sidebar;
