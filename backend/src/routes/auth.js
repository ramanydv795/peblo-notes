const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { supabaseAdmin } = require("../lib/supabase");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const { data: existing } = await supabaseAdmin
      .from("users").select("id").eq("email", email).single();
    if (existing)
      return res.status(409).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const { error } = await supabaseAdmin
      .from("users").insert({ id, name, email, password: hashed });
    if (error) throw error;

    res.status(201).json({ token: generateToken(id), user: { id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const { data: user } = await supabaseAdmin
      .from("users").select("*").eq("email", email).single();
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;