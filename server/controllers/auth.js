function registerUser(req, res) {
  const { name } = req.body;

  if (name) {
    res.status(200).json(name);
  } else {
    res.status(200).json({ error: "name not found" });
  }
}

module.exports = { registerUser };
