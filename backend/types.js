// This file constains all the validation schema's for inputs we will be receiving from the users
// Using the Zod library

const z = require("zod");

const todoSchema = z.object({
  title: z.string(),
  description: z.string(),
  projectId: z.string(),
});

const getTodoSchema = z.object({
  projectId: z.string(),
});

const todoUpdateSchema = z.object({
  id: z.string(),
  status: z
    .literal("Yet to Start")
    .or(z.literal("In Progress"))
    .or(z.literal("Completed")),
});

const signUpSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

// The strict() method ensures that no other field is present in the object apart from the mentioned ones
const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

const projectSchema = z.object({
  title: z.string().min(3),
});

const deleteSchema = z.object({
  id: z.string(),
});

module.exports = {
  todoSchema: todoSchema,
  todoUpdateSchema: todoUpdateSchema,
  signUpSchema: signUpSchema,
  signInSchema: signInSchema,
  projectSchema: projectSchema,
  getTodoSchema: getTodoSchema,
  deleteSchema: deleteSchema,
};