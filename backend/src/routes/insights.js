const express = require("express");
const { supabaseAdmin } = require("../lib/supabase");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  try {
    const { data: notes, error } = await supabaseAdmin
      .from("notes")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("archived", false)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    // Total notes
    const totalNotes = notes.length;

    // Recently edited (last 5)
    const recentNotes = notes.slice(0, 5).map((n) => ({
      id: n.id,
      title: n.title,
      updated_at: n.updated_at,
    }));

    // Most used tags
    const tagCount = {};
    notes.forEach((note) => {
      (note.tags || []).forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // AI usage
    const aiUsed = notes.filter((n) => n.ai_used).length;

    // Weekly activity — notes updated in last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyNotes = notes.filter(
      (n) => new Date(n.updated_at) > oneWeekAgo
    ).length;

    res.json({
      totalNotes,
      recentNotes,
      topTags,
      aiUsed,
      weeklyNotes,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

module.exports = router;