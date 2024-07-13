import { z } from "zod";

const titleSchema = z.string().min(3);
const descriptionSchema = z.string();

export {titleSchema, descriptionSchema};