import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/shared/${shareId}`);
        setNote(data.note);
      } catch (err) {
        setError("Note not found or not public.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [shareId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-gray-500">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg">Peblo Notes</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            Public Note
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{note.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {note.tags?.map((tag) => (
            <span key={tag} className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>

        <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap mb-8">
          {note.content}
        </div>

        {note.ai_summary && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs text-violet-400 uppercase tracking-wide font-medium mb-2">AI Summary</p>
            <p className="text-gray-700 text-sm leading-relaxed">{note.ai_summary}</p>
            {note.ai_action_items?.length > 0 && (
              <>
                <p className="text-xs text-violet-400 uppercase tracking-wide font-medium mt-3 mb-2">Action Items</p>
                <ul className="space-y-1">
                  {note.ai_action_items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-violet-500">•</span>{item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Last updated: {new Date(note.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}