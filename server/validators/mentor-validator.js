const { z } = require('zod');

// Login schema
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

// Signup schema, extending login with additional fields
const SignupSchema = loginSchema.extend({
    fullName: z.string({ required_error: "Fullname is required" })
        .trim()
        .min(3, { message: "Fullname must have at least 3 characters" })
        .max(255, { message: "Fullname must not exceed 255 characters" }),
    jobTitle: z.string({ required_error: "Job Title is required" })
        .trim()
        .min(3, { message: "Job Title must have at least 3 characters" })
        .max(255, { message: "Job Title must not exceed 255 characters" }),
    industry: z.string({ required_error: "Industry is required" })
        .trim()
        .min(3, { message: "Industry must have at least 3 characters" })
        .max(255, { message: "Industry must not exceed 255 characters" }),
    company: z.string({ required_error: "Company is required" })
        .trim()
        .min(3, { message: "Company must have at least 3 characters" })
        .max(255, { message: "Company must not exceed 255 characters" }),
    linkedInUrl: z.string().url({ message: "Invalid LinkedIn URL" }),
    skills: z.array(z.string(), { required_error: "Skills are required" })
        .nonempty({ message: "Skills must not be empty" }),
    mentorshipTopics: z.array(z.string(), { required_error: "Mentorship topics are required" })
        .nonempty({ message: "Mentorship topics must not be empty" }),
    phoneNumber: z.string({ required_error: "Phone number is required" })
        .trim()
        .min(10, { message: "Phone number must have at least 10 digits" })
        .max(20, { message: "Phone number must not exceed 20 digits" }),
    yearsOfExperience: z.number({ required_error: "Years of experience is required" })
        .min(1, { message: "Years of experience must be valid" })
        .max(40, { message: "Years of experience must not exceed 40 years" }),
    bio: z.string({ required_error: "Bio is required" }).optional(),
});

module.exports = { SignupSchema, loginSchema };
