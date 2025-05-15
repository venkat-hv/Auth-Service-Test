async function getSessionUser(req, res) {
  try {
    const token = req.cookies["auth_token"];
    if (!token) return res.status(401).json({ error: "token is missing" });

    try {
      const user = jwt.verify(token, JWT_SECRET);
      res.status(200).json({ user });
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.log("ERROR in getSessionUser: ", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getSessionUser,
};
