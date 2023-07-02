const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

const Keycloak = require("keycloak-connect");
const session = require('express-session');
const memoryStore = new session.MemoryStore();

const keycloakConfig = {
  "realm": "bezpieczenstwo-realm",
  "auth-server-url": "http://localhost:8080/",
  "ssl-required": "external",
  "resource": "jacek",
  "bearer-only": true,
};

const keycloak = new Keycloak({
  store: memoryStore
}, keycloakConfig);

routes.use(keycloak.middleware());


routes.route("/users").get(keycloak.protect(), async function (req, res) {
  try {
    await keycloak.auth();
    const users = await keycloak.users.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd serwera");
  }
});

routes.route("/users/:id").delete(keycloak.protect(), async function (req, res) {
  const userId = req.params.id;

  try {
    await keycloak.auth();
    await keycloak.users.del({ id: userId });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd serwera");
  }
});



routes.route("/posts").delete(keycloak.protect(), async function (req, res) {
    const dbConnect = dbo.getDb("rybki");
    dbConnect.collection("posts").deleteMany({}, function (err, obj) {
        if (err) throw err;
    });
});

routes.route("/posts").post(keycloak.protect(), async function (req, res) {
    const { username, title, content, ipAddress, imageURL, timestamp, roles } = req.body;
    const dbConnect = dbo.getDb("rybki");
    const myobj = {
        username: username,
        title: title,
        content: content,
        ipAddress:  ipAddress,
        imageURL: imageURL,
        timestamp: timestamp,
        roles: roles,
    };
    dbConnect.collection("posts").insertOne(myobj, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

routes.route("/posts").get(keycloak.protect(), async function (req, res) {
  const dbConnect = dbo.getDb("rybki");
  if (req.kauth.grant.access_token.hasRealmRole("admin")) {
    dbConnect
      .collection("posts")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result.reverse());
      });
  }
  else {
    dbConnect
      .collection("posts")
      .find({}, { projection: { ipAddress: 0, comments: { ipAddress: 0 } } })
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result.reverse());
      });
  }
});


routes.route("/posts/:id").get(keycloak.protect(), async function (req, res) {
    const dbConnect = dbo.getDb("rybki");
    const id = req.params.id;
    const details = { _id: new ObjectId(id) };
    dbConnect
        .collection("posts")
        .findOne(details, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

routes.route("/posts/:id").delete(keycloak.protect(), async function (req, res) {
    const dbConnect = dbo.getDb("rybki");
    const id = req.params.id;
    const details = { _id: new ObjectId(id) };
    dbConnect.collection("posts").deleteOne(details, function (err, obj) {
        if (err) throw err;
    });
});

routes.route("/posts/:id/comments").post(keycloak.protect(), async function (req, res) {
    const { username, content, ipAddress, imageURL, timestamp, roles } = req.body;
    const dbConnect = dbo.getDb("rybki");
    const myobj = {
        username: username,
        content: content,
        ipAddress: ipAddress,
        imageURL: imageURL,
        timestamp: timestamp,
        roles: roles,
    };
    dbConnect.collection("posts").updateOne(
        { _id: new ObjectId(req.params.id) },
        { $push: { comments: myobj } },
        function (err, res) {
            if (err) throw err;
        }
    );
});

routes.route("/posts/:id/comments").get(keycloak.protect(), async function (req, res) {
    const dbConnect = dbo.getDb("rybki");
    const id = req.params.id;
    const details = { _id: new ObjectId(id) };
    if (req.kauth.grant.access_token.hasRole("admin")) {
        dbConnect
            .collection("posts")
            .findOne(details, function (err, result) {
                if (err) throw err;
                res.json(result.comments);
            });
    }
    else {
        dbConnect
            .collection("posts")
            .findOne(details, { projection: { comments: { ipAddress: 0 } } }, function (err, result) {
                if (err) throw err;
                res.json(result.comments);
            });
    }
});



routes.route("/posts/:postId/comments/:index").delete(function (req, res) {
  const dbConnect = dbo.getDb("rybki");
  const postId = req.params.postId;
  const commentIndex = parseInt(req.params.index);
  
  const postFilter = { _id: new ObjectId(postId) };
  
  dbConnect.collection("posts").findOne(postFilter, function (err, post) {
    if (err) throw err;
    
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    
    const comments = post.comments;
    
    if (commentIndex < 0 || commentIndex >= comments.length) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    
    comments.splice(commentIndex, 1);
    
    let updateQuery;
    
    if (comments.length === 0) {
      updateQuery = { $unset: { comments: "" } };
    } else {
      updateQuery = { $set: { comments: comments } };
    }
    
    dbConnect.collection("posts").updateOne(postFilter, updateQuery, function (err) {
      if (err) throw err;
      res.status(200).json({ message: "Comment deleted" });
    });
  });
});

routes.route("/posts/search/:query").get(keycloak.protect(), async function (req, res) {
  const dbConnect = dbo.getDb("rybki");
  const query = req.params.query;

  const searchFilter = {
    $or: [
      { username: { $regex: query, $options: "i" } },
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ],
  };

  dbConnect
    .collection("posts")
    .find(searchFilter)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


routes.route("/posts/add").post(keycloak.protect(), async function (req, res) {
    const dbConnect = dbo.getDb("rybki");
    const myobj = req.body;
    dbConnect.collection("posts").insertMany(myobj, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});



module.exports = routes;
