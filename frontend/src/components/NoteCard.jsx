export default function NoteCard({ note, onClick, onDelete }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-violet-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
          {note.title || "Untitled"}
        </h3>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-gray-300 hover:text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-lg leading-none"
        >
          x
        </button>
      </div>

      {note.content && (
        <p className="text-gray-500 text-xs line-clamp-3 mb-3">
          {note.content}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        {note.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(note.updated_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1">
          {note.ai_used && (
            <span className="text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded">AI</span>
          )}
          {note.is_public && (
            <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">Public</span>
          )}
        </div>
      </div>
    </div>
  );
}