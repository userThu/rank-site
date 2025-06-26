/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models to interact with the database
const User = require("./models/user");
const Person = require("./models/person");
const Comment = require("./models/comment");
const Link = require("./models/link");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.use(express.json());

//initialize socket
const socketManager = require("./server-socket");

// cloudinary: upload images to cloud and get their URL
const cloudinary = require("cloudinary").v2;
// create readable stream from buffer
const streamifier = require("streamifier");
// uploader
const multer = require("multer");

const upload = multer();

cloudinary.config({
  cloud_name: "ddn3ylwye",
  api_key: "845567364217261",
  api_secret: "Exr9sXKVkKCKFhNgwGXnjZoMWwc",
});

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/comments", (req, res) => {
  const query = {"personid": req.query.personid};
  Comment.find(query).then((commentObjArr) => {
    res.send(commentObjArr);
  })
});

router.get("/links", (req, res) => {
  const query = {"personid": req.query.personid};
  Link.find(query).then((linkObjArr) => {
    if (linkObjArr.length === 0) {
      res.status(404).send({message: "Person not found"});
    } else {
      const linkObj = linkObjArr[0];
      if (req.query.icon === 'instagram') {
        res.send({link: linkObj.instagram_link});
      } else if (req.query.icon === 'tiktok') {
        res.send({link: linkObj.tiktok_link});
      } else if (req.query.icon === 'other') {
        res.send({link: linkObj.other_link});
      }
    }
  });
});

router.get("/people", (req, res) => {
  Person.find({}).then((people) => res.send(people));
});

router.get("/person", (req, res) => {
  const query = {"_id": req.query.personid};
  Person.find(query).then((person) => res.send(person));
})

router.get("/vote", (req, res) => {
  const query = {"_id": req.query.personid};
  Person.find(query).then((personObjArr) => {
    if (personObjArr.length === 0) {
      res.status(404).send({message: "Person not found"});
    } else {
      res.send(personObjArr[0]);
    }
  });
});

router.post("/comment", async (req, res) => {
  if (req.user) {
    try {
      const newComment = new Comment({
        personid: req.body.personid,
        author: req.user.name,
        comment: req.body.comment
      });

      newComment.save().then((comment) => res.send(comment));
    } catch (error) {
      res.status(500).send({ message: 'Error updating person', error: error.message });
    }
  }
});

router.post('/upload-image', upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const stream = cloudinary.uploader.upload_stream(
    { folder: "rank-avatars" },
    (error, result) => {
      if (error) {
        console.error("Cloudinary error:", error);
        return res.status(500).send(error);
      }
      res.send({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.post("/person", (req, res) => {
  const newPerson = new Person({
    name: req.body.name,
    votes: [],
    imagesrc: "https://res.cloudinary.com/ddn3ylwye/image/upload/v1750954508/noimage_yzjquz.jpg"
  });

  newPerson.save().then(async (savedPerson) => {
    const newLink = new Link({
      personid: savedPerson._id,
      instagram_link: "",
      tiktok_link: "",
      other_link: "",
    });

    await newLink.save();

    res.send(savedPerson);
  });  
})

/**
 * forgive this shit code
 */
router.put("/link-instagram", async (req, res) => {
  const updatedLink = await Link.findOneAndUpdate(
    { personid: req.body.personid },
    { $set: { instagram_link: req.body.link } },
    { new: true }
  );

  if (!updatedLink) {
    return res.status(404).send({ message: "Person not found" });
  }
  res.send({link: updatedLink.instagram_link});
});

router.put("/link-tiktok", async (req, res) => {
  const updatedLink = await Link.findOneAndUpdate(
    { personid: req.body.personid },
    { $set: { tiktok_link: req.body.link } },
    { new: true }
  );

  if (!updatedLink) {
    return res.status(404).send({ message: "Person not found" });
  }
  
  res.send({link: updatedLink.tiktok_link});
});

router.put("/link-other", async (req, res) => {
  const updatedLink = await Link.findOneAndUpdate(
    { personid: req.body.personid },
    { $set: { other_link: req.body.link } },
    { new: true }
  );

  if (!updatedLink) {
      return res.status(404).send({ message: "Person not found" });
    }

  res.send({link: updatedLink.other_link});
});

router.put('/unvote', async (req, res) => {
  if (req.user) {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.body.personid,
      { $pull: {votes: req.user._id}},
      {new: true}
    );

    if (!updatedPerson) {
        return res.status(404).send({ message: "Person not found" });
      }

    res.send(updatedPerson);
  } else {
    res.status(400).send({message: "Please log in to vote"});
  }
});

router.put('/vote', async (req, res) => {
  if (req.user) {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.body.personid,
      { $push: {votes: req.user._id}},
      {new: true}
    );

    if (!updatedPerson) {
        return res.status(404).send({ message: "Person not found" });
      }

    res.send(updatedPerson);
  } else {
    res.status(400).send({message: "Please log in to vote"});
  }
});

router.put('/save-image', async (req, res) => {
  const updatedPerson = await Person.findByIdAndUpdate(
      req.body.personid,
      { $set: { imagesrc: req.body.imagesrc } },
      { new: true }
    );

    if (!updatedPerson) {
      return res.status(404).send({ message: "Person not found" });
    }

    res.send(updatedPerson);
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
