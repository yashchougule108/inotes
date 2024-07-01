const jwt = require("jsonwebtoken");
const JWT_Secret = "harryisgoodboy";

const fetchuser = (req, res, next) => {
  //get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate using a vslid token" });
  }
  try {
    const data = jwt.verify(token, JWT_Secret);
    req.user = data.user;
  } catch (error) {
    res.status(401).send({ error: "please authenticate using a vslid token" });
  }

  next();
};

module.exports = fetchuser;
