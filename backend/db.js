require("dotenv").config();

const mongoose = require("mongoose");

// console.log(process.env.MONGO_URI);
// console.log(typeof process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI);

const ProjectSchema = new mongoose.Schema({
  title: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  todos: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todos",
      },
    ],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const ToDoSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Yet to Start", "In Progress", "Completed"],
    default: "Yet to Start",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  inProgressAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  projects: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    default: [],
  },
});

const Todo = mongoose.model("Todo", ToDoSchema);
const Project = mongoose.model("Project", ProjectSchema);
const User = mongoose.model("User", UserSchema);

module.exports = {
  Todo,
  User,
  Project,
};