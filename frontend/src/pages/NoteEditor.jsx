import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saved, setSaved] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get("/notes");
        const found = data.notes.find((n) => n.id === id);
        if (found) {
          setNote(found);
          setTitle(found.title);
          setContent(found.content);
          setTags(found.tags || []);
          if (found.is_public) {
            setShareUrl(`${window.location.origin}/shared/${found.share_id}`);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNote();
  }, [id]);

  // Auto-save after 1 second of inactivity
  const autoSave = useCallback(async (newTitle, newContent, newTags) => {
    setSaving(true);
    try {
      await api.patch(`/notes/${id}`, {
        title: newTitle,
        content: newContent,
        tags: newTags,
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [id]);

  useEffect(() => {
    if (!note) return;
    setSaved(false);
    const timer = setTimeout(() => autoSave(title, content, tags), 1000);
    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const generateAI = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post(`/notes/${id}/generate-summary`);
      setNote(data.note);
    } catch (err) {
      alert(err.response?.data?.error || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleShare = async () => {
    try {
      const newPublic = !note?.is_public;
      const { data } = await api.patch(`/notes/${id}`, { is_public: newPublic });
      setNote(data.note);
      if (newPublic) {
        const url = `${window.location.origin}/shared/${data.note.share_id}`;
        setShareUrl(url);
      } else {
        setShareUrl("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyShareUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  if (!note) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-500 hover:text-gray-900 text-sm font-medium"
        >
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {saving ? "Saving..." : saved ? "Saved" : "Unsaved"}
          </span>
          <button
            onClick={generateAI}
            disabled={aiLoading}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {aiLoading ? "Generating..." : "Generate AI Summary"}
          </button>
          <button
            onClick={toggleShare}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              note.is_public
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {note.is_public ? "Public" : "Make Public"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-4xl font-bold text-gray-900 border-none outline-none mb-4 bg-transparent placeholder-gray-300"
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
            >
              #{tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-500">x</button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Add tag..."
            className="text-sm text-gray-500 outline-none bg-transparent"
          />
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full min-h-96 text-gray-700 text-base leading-relaxed border-none outline-none resize-none bg-transparent"
        />

        {/* Share URL */}
        {shareUrl && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm font-medium text-green-700 mb-2">Share link</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 text-sm bg-white border border-green-200 rounded-lg px-3 py-2 text-gray-600"
              />
              <button
                onClick={copyShareUrl}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {note.ai_summary && (
          <div className="mt-6 bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs text-violet-400 uppercase tracking-wide font-medium mb-2">
              AI Summary
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {note.ai_summary}
            </p>
            {note.ai_action_items?.length > 0 && (
              <>
                <p className="text-xs text-violet-400 uppercase tracking-wide font-medium mb-2">
                  Action Items
                </p>
                <ul className="space-y-1">
                  {note.ai_action_items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-violet-500 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {note.ai_suggested_title && note.ai_suggested_title !== title && (
              <div className="mt-3 pt-3 border-t border-violet-200">
                <p className="text-xs text-violet-400 mb-1">Suggested title</p>
                <button
                  onClick={() => setTitle(note.ai_suggested_title)}
                  className="text-sm text-violet-600 hover:underline font-medium"
                >
                  Use: "{note.ai_suggested_title}"
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}