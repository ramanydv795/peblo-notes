const express = require("express");
const { supabaseAdmin } = require("../lib/supabase");
const { protect } = require("../middleware/auth");
const { generateNoteInsights } = require("../lib/groq");

const router = express.Router();
router.use(protect);

// POST /notes/:id/generate-summary
router.post("/:id/generate-summary", async (req, res) => {
  try {
    const { data: note } = await supabaseAdmin
      .from("notes").select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .single();

    if (!note)
      return res.status(404).json({ error: "Note not found" });

    if (!note.content || note.content.trim().length < 20)
      return res.status(400).json({ error: "Note content too short for AI analysis" });

    const insights = await generateNoteInsights(note.content, note.title);

    const { data, error } = await supabaseAdmin
      .from("notes")
      .update({
        ai_summary: insights.summary,
        ai_action_items: insights.action_items,
        ai_suggested_title: insights.suggested_title,
        ai_used: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ note: data, insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;