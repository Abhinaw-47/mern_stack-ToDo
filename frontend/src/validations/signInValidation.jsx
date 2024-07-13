import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

export {emailSchema, passwordSchema};