const express = require("express");
const debug = require("debug")("app:sessionsRouter");
const { MongoClient, ObjectId } = require("mongodb");
const sessions = require("../data/sessions.json");
const speakerService = require("../services/speakerService");

const sessionsRouter = express.Router();
sessionsRouter.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("auth/signin");
  }
});

sessionsRouter.route("/").get((req, res) => {
  const url =
    "mongodb+srv://sergiorturizo:Sergiot97@primercluster.viwrg.mongodb.net/?retryWrites=true&w=majority";
  const dbName = "PrimerCluster";

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug("Connected to the mongo DB");

      const db = client.db(dbName);

      const sessions = await db.collection("sessions").find().toArray();
      res.render("sessions", { sessions });
    } catch (error) {
      debug(error.stack);
    }
    client.close();
  })();
});

sessionsRouter.route("/:id").get((req, res) => {
  const id = req.params.id;
  const url =
    "mongodb+srv://sergiorturizo:Sergiot97@primercluster.viwrg.mongodb.net/?retryWrites=true&w=majority";
  const dbName = "PrimerCluster";

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug("Connected to the mongo DB");

      const db = client.db(dbName);

      const session = await db
        .collection("sessions")
        .findOne({ _id: new ObjectId(id) });

      const speaker = await speakerService.getSpeakerById(
        session.speakers[0].id
      );

      session.speaker = speaker.data;
      res.render("session", {
        session,
      });
    } catch (error) {
      debug(error.stack);
    }
    client.close();
  })();
});

module.exports = sessionsRouter;
