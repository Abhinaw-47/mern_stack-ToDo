const mongoose = require("mongoose");


mongoose.connect(
  "mongodb+srv://abhi11naw:Abhi%402002@cluster0.lo3j0qm.mongodb.net/todo"
);

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
});


async function updateUsers() {
  try {
    await User.updateMany({}, [
      { $set: { projects: [] } }, 
      { $unset: ["project"] },
    ]);

    console.log("Users updated");
  } catch (error) {
    console.error("Error updating Users:", error);
  }
}


async function updateData() {
  try {
    await updateUsers();
  } finally {
   
    mongoose.connection.close();
  }
}


updateData();
console.log("Done!");