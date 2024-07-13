const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const {
  todoSchema,
  todoUpdateSchema,
  signUpSchema,
  signInSchema,
  projectSchema,
  getTodoSchema,
  deleteSchema,
} = require("./types");
const { Todo, User, Project } = require("./db");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/verifyToken");

const PORT = 3001;
const JWT_PASSWORD = process.env.JWT_PASSWORD;
const app = express();


app.use(express.json());
app.use(cors());
// app.use(verifyToken);

app.post("/project", verifyToken, async (req, res) => {
  const newProject = projectSchema.safeParse(req.body);
  let userId = await User.findOne({ email: req.user.email });

  if (newProject.success) {
    try {
      const existingProject = await Project.findOne({
        title: newProject.data.title,
      });

      if (
        existingProject &&
        existingProject.user.toString() === userId._id.toString()
      ) {
        res.status(420).json({
          message: "Project with a similar title already exists for this user",
        });
        return;
      }

   
      const newProject_DB = await Project.create({
        title: newProject.data.title,
        user: userId._id,
      });

      // console.log(newProject_DB);

 
      const updateUser = await User.updateOne(
        {
          email: req.user.email,
        },
        {
          $push: { projects: newProject_DB._id },
        }
      );

      res.status(200).json({
        message: "Project successfully created",
      });
    } catch (e) {}
  } else {
    res.status(432).json({
      message: "Project title requires min. 3 characters",
    });
  }
});

app.get("/name", verifyToken, async (req, res) => {
  res.status(200).json({
    name: req.user.name,
  });
});


app.get("/projects", verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findOne({
      email: req.user.email,
    });
    const userId = currentUser._id;
    const allProjects = await Project.find({ user: userId });
    res.status(200).json({
      allProjects,
    });
  } catch (e) {
    res.status(400).json({
      message: "Some error occurred",
    });
  }
});


app.post("/todo", verifyToken, async (req, res) => {
  const newTodo = todoSchema.safeParse(req.body);
  // console.log("Body:" + req.body);
  // console.log(newTodo);

  if (newTodo.success) {
  
    try {
    
      let userId = await User.findOne({ email: req.user.email });

      const project = await Project.findOne({
        _id: newTodo.data.projectId,
        user: userId._id,
      });

      if (!project) {
        res.status(409).json({
          message: "Project ID entered is invalid",
        });
        return;
      }

     
      const newTodo_DB = await Todo.create({
        title: newTodo.data.title,
        description: newTodo.data.description,
        user: userId._id,
        project: newTodo.data.projectId,
      });

     
      const updateProject = await Project.updateOne(
        {
          _id: newTodo.data.projectId,
          user: userId._id,
        },
        {
          $push: {
            todos: newTodo_DB._id,
          },
        }
      );
      res.status(200).json({
        message: "New todo has been created",
        value: newTodo_DB,
      });
    } catch (e) {
      res.status(400).json({
        message: "Some error occurred while creating the Todo in the database",
        error: e,
      });
    }
  } else {
    res.status(411).json({
      message:
        "Some wrong type of data has been passed. Please check your ProjectId",
    });
  }
});


app.get("/todos", verifyToken, async (req, res) => {
  try {
    const projectId = req.query.projectId; 
    // console.log(projectId);

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const currentUser = await User.findOne({ email: req.user.email });

    const project = await Project.findOne({
      _id: projectId,
      user: currentUser._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const todoIds = project.todos;

    const todos = await Todo.find({ _id: { $in: todoIds } });

    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.put("/updateStatus", verifyToken, async (req, res) => {
  const id = todoUpdateSchema.safeParse(req.body);
  // console.log(id);

  if (id.success) {
   
    const findTodo = await Todo.findOne({
      _id: id.data.id,
    });
    // console.log(findTodo);
    const associatedUserId = findTodo.user;
    const findUser = await User.findOne({
      _id: associatedUserId,
    });

    if (findUser.email == req.user.email) {
      try {
        if (id.data.status === "Completed") {
          const todoNotInProg = await Todo.findOne({
            _id: id.data.id,
            inProgressAt: null,
          });
          if (todoNotInProg) {
            const updateTodo = await Todo.updateOne(
              {
                _id: id.data.id,
              },
              {
                status: id.data.status,
                completedAt: new Date(),
                inProgressAt: new Date(),
              }
            );
          } else {
            const updateTodo = await Todo.updateOne(
              {
                _id: id.data.id,
              },
              {
                status: id.data.status,
                completedAt: new Date(),
              }
            );
          }
        } else if (id.data.status === "In Progress") {
          const updateTodo = await Todo.updateOne(
            {
              _id: id.data.id,
            },
            {
              status: id.data.status,
              completedAt: null,
              inProgressAt: new Date(),
            }
          );
        } else {
          const updateTodo = await Todo.updateOne(
            {
              _id: id.data.id,
            },
            {
              status: id.data.status,
              completedAt: null,
              inProgressAt: null,
            }
          );
        }

        
        const associatedProject = await Project.findOne({
          _id: findTodo.project,
        });

       
        let totalTodos = associatedProject.todos.length;
        let completedTodos = 0;

        for (let i = 0; i < totalTodos; i++) {
          const currentTodoId = associatedProject.todos[i];
          const currentTodo = await Todo.findOne({
            _id: currentTodoId,
          });

          if (currentTodo.status == "Completed") {
            completedTodos += 1;
          }
        }

        let updatedProgress = (completedTodos / totalTodos) * 100;

        const updateProject = await Project.updateOne(
          {
            _id: findTodo.project,
          },
          {
            progress: updatedProgress,
          }
        );

        res.status(200).json({
          message: "Updated the status",
        });
      } catch (e) {
        console.log(e);
        res.status(400).json({
          message: "Some error occurred",
        });
      }
    } else {
      res.status(401).json({
        message: "Unauthorized access to the Todo",
      });
    }
  } else {
    res.status(411).json({
      message: "Wrong Input, either the ID or the status",
    });
  }
});

app.post("/signup", async (req, res) => {
  const body = signUpSchema.safeParse(req.body);

  if (body.success) {
  
    const existingUser = await User.findOne({
      email: body.data.email,
    });

    if (existingUser) {
      res.status(420).json({
        message: "User with a similar email already exists",
      });
      return;
    }

    try {
      const newUser = await User.create({
        name: body.data.name,
        email: body.data.email,
        password: body.data.password,
      });
      //console.log(`New user created: ${newUser}`);
      res.status(200).json({
        message: "User created!",
      });
    } catch (e) {
      res.status(400).json({
        message: "Problem while creating user in the database",
      });
    }
  } else {
    res.status(411).json({
      message: "Inputs are invalid, please check and try again",
      error: body.error,
    });
  }
});


app.post("/signin", async (req, res) => {
  const body = signInSchema.safeParse(req.body);

  if (body.success) {

    try {
      const existingUser = await User.findOne({
        email: body.data.email,
        password: body.data.password,
      });

      // console.log(existingUser);

      if (existingUser) {
        let token = jwt.sign(
          {
            email: body.data.email,
            name: existingUser.name,
          },
          JWT_PASSWORD
        );
        res.status(200).json({
          token,
        });
        return;
      } else {
        res.status(403).json({
          message: "User not found",
        });
      }
    } catch (e) {
      res.status(401).json({
        message: "Something went wrong in the database call",
      });
    }
  } else {
    res.status(411).json({
      message: body.error,
    });
  }
});


app.delete("/project", verifyToken, async (req, res) => {
  const body = deleteSchema.safeParse(req.body);
  const currentUser = await User.findOne({ email: req.user.email });

  if (body.success) {
  
    const deleteTodo = await Todo.deleteMany({
      project: body.data.id,
    });

    console.log("Delete Todo: ");
    console.log(deleteTodo);

    const deleteProject = await Project.deleteOne({
      _id: body.data.id,
    });

    console.log("Delete Project: ");
    console.log(deleteProject);

    const updatedProjects = currentUser.projects.filter(
      (projectId) => projectId.toString() !== body.data.id
    );

    const updateUser = await User.updateOne(
      {
        _id: currentUser._id,
      },
      {
        projects: updatedProjects,
      }
    );

    console.log("Update User: ");
    console.log(updateUser);

    res.status(200).json({
      message: "Project Deleted",
    });
  } else {
    res.status(454).json({
      message: "Inavlid Project ID",
    });
  }
});


app.delete("/todo", verifyToken, async (req, res) => {
  const body = deleteSchema.safeParse(req.body);
  const currentUser = await User.findOne({ email: req.user.email });

  // console.log("Current User: ");
  // console.log(currentUser);

  if (body.success) {
    const currentTodo = await Todo.findOne({
      _id: body.data.id,
    });

    if (currentTodo) {
      console.log("---------In here");
      const currentProjectId = currentTodo.project;
      const currentProject = await Project.findOne({
        user: currentUser._id,
        _id: currentProjectId,
      });

      console.log("----------Current Project ID: ");
      console.log(currentProjectId);

      console.log("-----------Current Project: ");
      console.log(currentProject);

      
      const deleteTodo = await Todo.deleteOne({
        _id: body.data.id,
        user: currentUser._id,
      });

      console.log("--------Delete Todo");
      console.log(deleteTodo);

    
      const updatedTodosArray = currentProject.todos.filter(
        (todoId) => todoId.toString() !== body.data.id
      );

      console.log(updatedTodosArray);

      const updateProject = await Project.updateOne(
        {
          _id: currentProject._id,
        },
        {
          todos: updatedTodosArray,
        }
      );

      res.status(200).json({
        message: "Todo deleted",
      });
    } else {
      res.status(440).json({
        message: "Todo with the given ID doesn't exist",
      });
      return;
    }
  } else {
    res.status(460).json({
      message: "Invalid Todo ID",
    });
  }
});

app.all("*", (req, res) => {
  res.status(200).json({
    message: "This might not be the page you're looking for",
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});