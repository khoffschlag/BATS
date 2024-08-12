const isAuthenticated = require("./isAuthenticated.js");

const { generateExercise } = require("./exercise/generate");
const { checkExercise } = require("./exercise/check");

const express = require("express");
const session = require("express-session");

const path = require("path");
const cors = require("cors");
const argon2 = require("argon2");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
const mongoose = require("mongoose");
const Tutorial = require("./models/tutorialModel");
const UserBehavior = require("./models/userBehaviorModel");
const User = require("./models/userModel");
const uri = process.env.MONGO_URI;

app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:4200",
  credentials: true,
};

console.log(corsOptions);

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, // do not resave sessions that have not been changed
    saveUninitialized: true, // saves new sessions
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 1 day in seconds
    }),
    cookie: { secure: "auto", httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

/**
 * Handles user registration.
 * @route POST /api/sign-up
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The desired username.
 * @param {string} req.body.password - The desired password.
 * @param {Array} [req.body.quizResults] - Optional quiz results.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response indicating success or failure.
 */
app.post("/api/sign-up", async (req, res) => {
  try {
    const { username, password, correctAnswerStreak } = req.body;
    console.log("retrieved signup data:", {
      username,
      password,
      correctAnswerStreak,
    });
    const existing = await User.findOne({ username });
    
    // Check if username is already taken
    if (existing) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // Creating a new user
    const user = new User({ username, password, correctAnswerStreak });
    await user.save(); // Save new user to the database

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(400).json(error);
  }
});

/**
 * Handles user login.
 * @route POST /api/sign-in
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Number} req.body.correctAnswerStreak - quiz result.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response indicating success or failure.
 */
app.post("/api/sign-in", async (req, res) => {
  try {
    const { username, password, correctAnswerStreak } = req.body;
    console.log("Received login request:", username);
    const user = await User.findOne({ username });
    console.log("Found user:", user);

    // Find the user by username
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Verify the provided password
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Store the quiz result in case the user did the quiz before login
    if (correctAnswerStreak !== null && correctAnswerStreak > user.correctAnswerStreak) {
      user.correctAnswerStreak = correctAnswerStreak;
      await user.save();
    }

    // Modify the session
    req.session.user = { id: user._id, username: user.username };
    console.log("Logged user:", { id: user._id, username: user.username });
    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Handles user logout.
 * @route POST /api/logout
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response indicating authentication status.
 */
app.post("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Could not log out, please try again" });
      } else {
        console.log("User logged out");
        res.send({ message: "Logout successful " });
      }
    });
  } else {
    res.status(400).json({ message: "You are not logged in " });
  }
});

/**
 * Checks if the user is authenticated by verifying the session.
 * @route GET /api/is-authenticated
 * @middleware {function} isAuthenticated - Middleware function that checks if the user is authenticated. If not, it sends a 401 response.
 * @param {Object} req - Express request object.
 * @param {Object} req.session - Session object containing user information.
 * @param {boolean} req.isAuthenticated - Indicates whether the user is authenticated.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with the authentication status.
 */ 
app.get("/api/is-authenticated", isAuthenticated, (req, res) => {
  res.status(200).json({ isAuthenticated: req.isAuthenticated });
});

/**
* Handles updating the user streak value
* @route POST /api/update-streak
* @param {Object} req - Express request object.
* @param {Object} res - Express response object.
* @param {Object} req.session.user - Holds the information of the currently authenticated user.
* @param {String} req.session.user.username - Username string of the currently authenticated user.
* @param {String} req.body.streak - The new streak value to be updated.
* @returns {Object} JSON response.
 */
app.post("/api/update-streak", async (req, res) => {
  //Checks if user logged in with a valid session and the user object has valid username.
  if (!req.session.user || !req.session.user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const username = req.session.user.username;
    const correctAnswerStreak = req.body.correctAnswerStreak;
    const user = await User.findOne({ username });

    // Find the user by username
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Update the user's streak value, if the condition was met
    if(correctAnswerStreak !== null && correctAnswerStreak > user.correctAnswerStreak){
      user.correctAnswerStreak = correctAnswerStreak;
      await user.save();
      res.status(200).json({ message: "Streak updated successfully" });
    }
    else{
    res.status(200).json({ message: "no update is done, streak is lower or equals to the stored value in the DB" });
  } 
  }catch (error) {
    res.status(500).json(error);
  }
});

/**
* Check and return the current streak of the authenticated user.
* @route GET /api/check-streak
* @param {Object} req - Express request object.
* @param {Object} res - Express response object.
* @param {String} req.session.user.username - Username string of the logged in user.
* @returns {Object} JSON response with the current streak of the user.
 */
app.get("/api/check-streak", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("User in session: ", req.session.user.username);
    const username = req.session.user.username;
    const user = await User.findOne({ username });

    //Find user by username.
    if (!user) {
      console.log(user);
      return res.status(404).json({ message: "User not found" });
    }

    //Fetch the streak value.
    const streak = user.correctAnswerStreak || 0;
    res.status(200).json({ streak });
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Returns list of users store in the database.
 * @route POST /api/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response returns a list of stored usernames.
 */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "error fetching the users" });
  }
});

//Endpoint to get tutorial by title passed in the body
app.post("/api/theory", async (req, res) => {
  try {
    const { topic } = req.body;
    console.log(`/api/theory/ got called with topic: ${topic}`);

    if ((topic == null) | (topic.length === 0)) {
      res
        .status(400)
        .json({ error: "No topic was submitted in the POST request!" }); // Send bad request error!
    }

    const tutorials = await Tutorial.findOne({
      codeName: new RegExp(topic),
    }).exec();
    console.log("Found tutorials:", tutorials); // Log found tutorials

    if (tutorials == null || tutorials.length === 0) {
      return res.status(404).send({ message: "No tutorial found." });
    }
    res.status(200).json(tutorials);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/api/exercise/", function (req, res) {
  const { topic } = req.body;

  console.log(`/api/exercise/ got called with topic: ${topic}`);

  // Let's check if topic is undefined, empty string or similar
  if ((topic == null) | (topic.length === 0)) {
    res
      .status(400)
      .json({ error: "No topic was submitted in the POST request!" }); // Send bad request error!
  }

  response = generateExercise(topic);
  let title = response.title;
  let task = response.task;
  let targetAnswer = response.targetAnswer;

  res.json({ title: title, task: task, targetAnswer: targetAnswer });
});

app.post("/api/check/", function (req, res) {
  const { data } = req.body;

  console.log(data);

  let topic = data.topic;
  let task = data.task;
  let userAnswer = data.userAnswer;
  let targetAnswer = data.targetAnswer;
  let currentTry = data.currentTry;

  console.log(
    `/api/check/ got called with topic: ${topic}, userAnswer: ${userAnswer} and targetAnswer: ${targetAnswer}`
  );

  // Let's check if topic, userAnswer or targetAnswer is undefined, empty string or similar
  if ((topic == null) | (topic.length === 0)) {
    res
      .status(400)
      .json({ error: "No topic was submitted in the POST request!" }); // Send bad request error!
  }

  if (userAnswer == null) {
    res
      .status(400)
      .json({ error: "No userAnswer was submitted in the POST request!" }); // Send bad request error!
  }

  if (targetAnswer == null) {
    res
      .status(400)
      .json({ error: "No targetAnswer was submitted in the POST request!" }); // Send bad request error!
  }

  response = checkExercise(topic, task, userAnswer, targetAnswer, currentTry);
  let result = response.result;
  let feedback = response.feedback;
  res.json({ result: result, feedback: feedback });
});

app.get("/api/quiz/", function (req, res) {
  const possibleTopics = [
    "binaryConversion",
    "decimalConversion",
    "binaryArithmetic",
    "logicalOperations",
  ];
  let topic = possibleTopics[Math.floor(Math.random() * possibleTopics.length)];

  response = generateExercise(topic);
  let title = response.title;
  let task = response.task;
  let targetAnswer = response.targetAnswer;

  res.json({
    topic: topic,
    title: title,
    task: task,
    targetAnswer: targetAnswer,
  });
});

/**
 * Logs user behavior events to the database.
 * @route POST /api/log
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.userId - The unique identifier of the user performing the event.
 * @param {string} req.body.eventType - The type of event being logged.
 * @param {Object} req.body.eventData - Additional data related to the event.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response indicating success or failure.
 */
app.post("/api/log", async (req, res) => {
  console.log("Logging Event is triggered");
  const { userId, eventType, eventData } = req.body;
  //console.log('Received data:', req.body);
  const userBehavior = new UserBehavior({ userId, eventType, eventData });

  try {
    const savedBehavior = await userBehavior.save();
    //console.log('Saved log data:', savedBehavior);
    res.status(200).json({ message: "User behavior saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error saving user behavior." });
  }
});

//HEROKU
app.use(express.static(__dirname + "/../dist/bats/browser"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/../dist/bats/browser/index.html"));
});
//-----------------------------------------------

async function run() {
  try {
    // try to connect to MongoDB using mongoose
    await mongoose.connect(uri, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log("Successfully connected to MongoDB!");

    app.listen(process.env.PORT || 3000, () => {
      console.log("Express running like Usain Bolt! Yeah!");
    });
  } catch (error) {
    console.error("Oopsi, not connection for you");
  } finally {
    // Ensures that the connection is closed when application terminated
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed");
      process.exit(0);
    });
  }
}
run().catch(console.dir);
