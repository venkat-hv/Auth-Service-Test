const pool = require("./database");

async function fetchUser(email) {
  try {
    if (
      !email ||
      email == "null" ||
      email == "undefined" ||
      email.length === 0
    ) {
      return null;
    }

    const { rows } = await pool.query(
      "SELECT * FROM testing.test_users WHERE email = $1",
      [email]
    );
    return rows[0];
  } catch (error) {
    error.message = ` /in fetchUser: ${error.message}`;
    throw error;
  }
}

async function authenticateGoogleUser(
  request,
  accessToken,
  refreshToken,
  profile,
  done
) {
  try {
    const { email } = profile;
    const user = await fetchUser(email);
    if (!user) {
      console.log("User not found");
      // const { name, email } = profile;
      // const newUser = await pool.query(
      //   "INSERT INTO testing.test_users (name, email) VALUES ($1, $2) RETURNING *",
      //   [name, email]
      // );
      // return done(null, newUser.rows[0]);
      return done(null, false, { message: "User not found" });
    }

    console.log("User found: ", user);
    return done(null, user);
  } catch (error) {
    console.error("ERROR in authenticateGoogleUser: ", error);
    return done(error);
  }
}

module.exports = {
  authenticateGoogleUser,
};
