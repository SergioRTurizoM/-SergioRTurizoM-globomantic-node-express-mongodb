const express = require("express");
const debug = require("debug")("app:sessionsRouter");
const { MongoClient, ObjectId } = require("mongodb");
const passport = require('passport');

const authRouter = express.Router();

authRouter.route("/signUp").post((req, res) => {
  const { username, password } = req.body;
  const url =
    "mongodb+srv://sergiorturizo:Sergiot97@primercluster.viwrg.mongodb.net/?retryWrites=true&w=majority";
  const dbName = "PrimerCluster";

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection("users").insertOne(user);
      debug(results);
      req.login(results.ops[0], () => {
        res.redirect("/auth/profile");
      });
    } catch (error) {
      debug(error);
    }
    client.close();
  })();
});

authRouter
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post(
    passport.authenticate("local", {
      successRedirect: "/auth/profile",
      failureMessage: "/",
    })
  );
authRouter.route("/profile").get((req, res) => {
  res.json(req.user);
});

module.exports = authRouter;
