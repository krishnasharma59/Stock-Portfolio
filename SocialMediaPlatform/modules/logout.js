function logout(req, res) {
  try {
    // ❌ remove token
    res.clearCookie("token");

    // redirect to login page
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Logout failed");
  }
}

export default logout;