const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const { SECRET_KEY } = require("./utils.js");
const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  let token = req.session.token;
  if (token) {
    let decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.json({ message: "Invalid token" }).status(401);
    }
  } else {
    return res.json({ message: "Unauthorized" }).status(401);
  }
  //Write the authenication mechanism here
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
