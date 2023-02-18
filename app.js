require("dotenv").config()

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.set("strictQuery", true);

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne(
      {
        email: username,
      },
      (err, founduser) => {
        if (err) {
          console.log(err);
        } else {
          if (founduser) {
            if (founduser.password === password) {
              res.render("secrets");
            }
          }
        }
      }
    );
  });

app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post(function (req, res) {
    console.log();
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save((err) => {
      if (!err) {
        res.render("secrets");
      } else {
        res.send(err);
      }
    });
  });

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
}

const userSchema = mongoose.Schema({
  email: String,

  password: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.listen(port, () => {
  console.log("Example app listening on port ${port}");
});
