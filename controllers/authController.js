const jwt = require("jsonwebtoken");

// Config
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const DOMAIN = process.env.DOMAIN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

// Cookie options
const cookieOptions = {
  httpOnly: true, // for security (prevents client-side js to access cookie)
  secure: NODE_ENV === "production" ? true : false, // for https
  sameSite: NODE_ENV === "production" ? "None" : "Lax", // for cross-site requests
  domain: DOMAIN, // cookie is accessible throughout this domain
  maxAge: 60 * 60 * 1000, // 1 hour
};

async function handleGoogleAuth(req, res, next) {
  try {
    const redirect = req.query.redirect;
    if (
      !redirect ||
      redirect == "null" ||
      redirect == "undefined" ||
      redirect.length === 0
    ) {
      return res.status(400).json({ message: "redirect is required" });
    }

    const authUrl = passport.authenticate("google", {
      scope: ["profile", "email"],
      state: encodeURIComponent(redirect),
    });
    return authUrl(req, res, next);
  } catch (error) {
    console.error("ERROR in handleGoogleAuth: ", error);
    return res.status(500).json({ message: error.message });
  }
}

async function handleGoogleAuthCallback(req, res) {
  try {
    // Successful login, issue our own JWT
    const token = jwt.sign(req.user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.cookie("auth_token", token, cookieOptions);
    const redirect = decodeURIComponent(req.query.state);

    return res.redirect(redirect);
  } catch (error) {
    console.error("ERROR in handleGoogleAuthCallback: ", error);
    return res.status(500).json({ message: error.message });
  }
}

async function handleLogout(req, res) {
  try {
    if (!req.query.redirect) {
      return res.status(400).json({ error: "redirect is required" });
    }

    res.clearCookie("auth_token", { domain: DOMAIN });
    const redirect = req.query.redirect;
    return res.redirect(redirect);
  } catch (error) {
    console.error("ERROR in handleLogout: ", error);
    return res.status(500).json({ message: error.message });
  }
}

async function handleGoogleAuthFailure(req, res) {
  try {
    return res.status(401).json({ message: "Google authentication failed" });
  } catch (error) {
    console.error("ERROR in handleGoogleAuthFailure: ", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  handleGoogleAuth,
  handleGoogleAuthCallback,
  handleLogout,
  handleGoogleAuthFailure,
};
