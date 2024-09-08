const { z } = require('zod');

// Login schema
const MenteeLoginSchema = z.object({
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

// Signup schema for mentees
const MenteeSignupSchema = z.object({
    fullName: z.string()
        .min(3, { message: "Fullname must have at least 3 characters" })
        .max(255, { message: "Fullname must not exceed 255 characters" })
        .transform(val => val.trim()), // Trim whitespace from fullName
    email: z.string()
        .email({ message: "Invalid Email address" })
        .min(3, { message: "Email must have at least 3 characters" })
        .max(255, { message: "Email must not be more than 255 characters" })
        .transform(val => val.trim()), // Trim whitespace from email
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(255, { message: "Password can't be greater than 255 characters" })
        .transform(val => val.trim()), // Trim whitespace from password
    phoneNumber: z.string()
        .optional()
        .nullable()
        .transform(val => val ? val.trim() : null)
        .refine(val => val === null || (val.length >= 10 && val.length <= 20), {
            message: "Phone number must have between 10 and 20 digits",
        }),
    profilePicture: z.string().optional(),
    currentEducationLevel: z.string().optional(),
    universityName: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    expectedGraduationYear: z.number().optional(),
    careerInterests: z.array(z.string()).optional(),
    desiredIndustry: z.array(z.string()).optional(),
    skillsToDevelop: z.array(z.string()).optional(),
    typeOfMentorshipSought: z.array(z.string()).optional(),
    preferredDaysAndTimes: z.array(z.string()).optional(),
    preferredMentorshipMode: z.string().optional(),
    personalIntroduction: z.string().optional(),
    linkedInProfileUrl: z.string().url().optional(),
});

module.exports = { MenteeSignupSchema, MenteeLoginSchema };
