const mongoose = require("mongoose");


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

async function updateTodos() {
  const currDate = new Date();
  try {
    await Todo.updateMany(
      {
        status: "In Progress",
      },
      [
        { $set: { inProgressAt: currDate } }, 
      ]
    );

    console.log("Todos updated");
  } catch (error) {
    console.error("Error updating Todos:", error);
  }
}


async function updateData() {
  try {
    await updateTodos();
  } finally {
 
    mongoose.connection.close();
  }
}


updateData();
console.log("Done!");