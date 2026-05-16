import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";
import NoteCard from "../components/NoteCard";
import Sidebar from "../components/Sidebar";
import InsightsPanel from "../components/InsightsPanel";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showInsights, setShowInsights] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedTag) params.tag = selectedTag;
      const { data } = await api.get("/notes", { params });
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag]);

  const fetchInsights = async () => {
    try {
      const { data } = await api.get("/insights");
      setInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const createNote = async () => {
    try {
      const { data } = await api.post("/notes", { title: "Untitled", content: "" });
      navigate(`/notes/${data.note.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        insights={insights}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        onNewNote={createNote}
        onLogout={logout}
        user={user}
      />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedTag ? `#${selectedTag}` : "All Notes"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="text-sm text-violet-600 hover:text-violet-800 font-medium"
              >
                {showInsights ? "Hide Insights" : "Show Insights"}
              </button>
              <button
                onClick={createNote}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + New Note
              </button>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white"
          />

          {/* Insights Panel */}
          {showInsights && insights && (
            <InsightsPanel insights={insights} />
          )}

          {/* Notes Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-gray-500 text-lg">No notes yet</p>
              <button
                onClick={createNote}
                className="mt-4 bg-violet-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-violet-700 transition-colors"
              >
                Create your first note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => navigate(`/notes/${note.id}`)}
                  onDelete={() => deleteNote(note.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}