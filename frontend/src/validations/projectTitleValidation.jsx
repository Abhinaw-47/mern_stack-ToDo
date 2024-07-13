import { z } from "zod";

const projectTitleSchema = z.string().min(3);

export { projectTitleSchema };