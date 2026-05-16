export default function InsightsPanel({ insights }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-1">Total Notes</p>
        <p className="text-3xl font-bold text-gray-900">{insights.totalNotes}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-1">This Week</p>
        <p className="text-3xl font-bold text-violet-600">{insights.weeklyNotes}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-1">AI Used</p>
        <p className="text-3xl font-bold text-violet-600">{insights.aiUsed}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-1">Top Tag</p>
        <p className="text-xl font-bold text-gray-900 truncate">
          {insights.topTags?.[0]?.tag ? `#${insights.topTags[0].tag}` : "—"}
        </p>
      </div>
    </div>
  );
}