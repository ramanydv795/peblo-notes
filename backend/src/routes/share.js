const express = require("express");
const { supabaseAdmin } = require("../lib/supabase");

const router = express.Router();

// GET /shared/:shareId — public, no auth needed
router.get("/:shareId", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("notes")
      .select("title, content, tags, category, ai_summary, ai_action_items, created_at, updated_at")
      .eq("share_id", req.params.shareId)
      .eq("is_public", true)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Note not found or not public" });

    res.json({ note: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shared note" });
  }
});

module.exports = router;