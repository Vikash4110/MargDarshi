const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid Email address" })
    .min(3, { message: "Email must have at least 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(255, { message: "Password can't be greater than 255 characters" }),
});

const SignupSchema = z.object({
  fullName: z
    .string({ required_error: "Fullname is required" })
    .trim()
    .min(3, { message: "Fullname must have at least 3 characters" })
    .max(255, { message: "Fullname must not exceed 255 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid Email address" })
    .min(3, { message: "Email must have at least 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(255, { message: "Password can't be greater than 255 characters" }),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(10, { message: "Phone number must have at least 10 digits" })
    .max(20, { message: "Phone number must not exceed 20 digits" }),
  jobTitle: z
    .string({ required_error: "Job Title is required" })
    .trim()
    .min(3, { message: "Job Title must have at least 3 characters" })
    .max(255, { message: "Job Title must not exceed 255 characters" }),
  industry: z
    .string({ required_error: "Industry is required" })
    .trim()
    .min(3, { message: "Industry must have at least 3 characters" })
    .max(255, { message: "Industry must not exceed 255 characters" }),
  yearsOfExperience: z
    .string({ required_error: "Years of experience is required" })
    .trim()
    .transform((val) => Number(val))
    .refine((val) => val >= 1 && val <= 40, {
      message: "Years of experience must be between 1 and 40",
    }),
  company: z
    .string({ required_error: "Company is required" })
    .trim()
    .min(3, { message: "Company must have at least 3 characters" })
    .max(255, { message: "Company must not exceed 255 characters" }),
  linkedInUrl: z.string().url({ message: "Invalid LinkedIn URL" }).optional(),
  skills: z.array(z.string()).min(1, { message: "At least one skill is required" }),
  mentorshipTopics: z
    .array(z.string())
    .min(1, { message: "At least one mentorship topic is required" }),
  bio: z.string().optional(),
  profilePicture: z.any().optional(), // Allow file upload
});

module.exports = { SignupSchema, loginSchema };