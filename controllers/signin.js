const signin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }

  db("login")
    .select("email", "hash")
    .where({ email })
    .first()
    .then((loginRow) => {
      if (!loginRow) {
        // No such email in login table
        return res.status(400).json("wrong credentials");
      }

      const isValid = bcrypt.compareSync(password, loginRow.hash);
      if (!isValid) {
        return res.status(400).json("wrong credentials");
      }

      return db("users")
        .where({ email })
        .first()
        .then((user) => {
          if (!user) {
            // Edge case: login exists but user row is missing
            return res.status(500).json("user record not found");
          }
          return res.json(user);
        });
    })
    .catch((err) => {
      console.error("Signin error:", err);
      return res.status(500).json("unable to sign in");
    });
};

export default signin;
