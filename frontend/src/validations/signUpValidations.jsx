import { z } from "zod";

const nameSchema = z.string().min(1);

const emailSchema = z.string().email();

const passwordSchema = z.string().min(8);

export {nameSchema, emailSchema, passwordSchema};