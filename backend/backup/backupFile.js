const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");


mongoose.connect(
  "mongodb+srv://abhi11naw:Abhi%402002@cluster0.lo3j0qm.mongodb.net/todo"
);


const Todo = mongoose.model("Todo", {
  title: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
});

let count = 0;


async function backupData(Model, fileName) {
  count += 1;
  try {
   
    const todos = await Model.find().lean(); 

   
    const jsonData = JSON.stringify(todos, null, 2);

   
    await promisify(fs.writeFile)(fileName, jsonData);

    console.log(`Backup successful for ${count}`);
  } catch (error) {
    console.error("Backup failed:", error);
  }
}


backupData(Todo, "TodoBackup");
backupData(User, "UserBackup");