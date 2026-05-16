export default function Sidebar({ insights, selectedTag, onTagSelect, onNewNote, onLogout, user }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Peblo Notes</h1>
        <p className="text-xs text-gray-400 mt-0.5">{user?.name}</p>
      </div>

      <button
        onClick={onNewNote}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg text-sm font-medium mb-6 transition-colors"
      >
        + New Note
      </button>

      <nav className="space-y-1 mb-6">
        <button
          onClick={() => onTagSelect("")}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            !selectedTag ? "bg-violet-50 text-violet-700 font-medium" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          All Notes {insights && `(${insights.totalNotes})`}
        </button>
      </nav>

      {insights?.topTags?.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 px-3">
            Tags
          </p>
          <div className="space-y-1">
            {insights.topTags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => onTagSelect(tag === selectedTag ? "" : tag)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex justify-between ${
                  selectedTag === tag ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>#{tag}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}