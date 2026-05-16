const express = require("express");
const { supabaseAdmin } = require("../lib/supabase");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// GET /notes
router.get("/", async (req, res) => {
  try {
    const { search, tag, sort = "updated_at" } = req.query;

    let query = supabaseAdmin
      .from("notes")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("archived", false)
      .order(sort, { ascending: false });

    if (search) query = query.ilike("title", `%${search}%`);
    if (tag) query = query.contains("tags", [tag]);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ notes: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST /notes
router.post("/", async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;
    const { data, error } = await supabaseAdmin
      .from("notes")
      .insert({
        user_id: req.user.id,
        title: title || "Untitled",
        content: content || "",
        tags: tags || [],
        category: category || "general",
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ note: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// PATCH /notes/:id
router.patch("/:id", async (req, res) => {
  try {
    const { title, content, tags, category, archived, is_public } = req.body;

    const { data: existing } = await supabaseAdmin
      .from("notes").select("id").eq("id", req.params.id)
      .eq("user_id", req.user.id).single();
    if (!existing)
      return res.status(404).json({ error: "Note not found" });

    const { data, error } = await supabaseAdmin
      .from("notes")
      .update({
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(tags !== undefined && { tags }),
        ...(category !== undefined && { category }),
        ...(archived !== undefined && { archived }),
        ...(is_public !== undefined && { is_public }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ note: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// DELETE /notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("notes")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.user.id);

    if (error) throw error;
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;