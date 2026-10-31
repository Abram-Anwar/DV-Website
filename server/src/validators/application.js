import { z } from "zod";

//? Checks the "YYYY-MM-DD" shape, then checks the date is real
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date");

//? A real date that is not in the future
const pastDate = dateString.refine(
  (v) => new Date(v) <= new Date(),
  "Date cannot be in the future",
);

//? Age in full years (same logic as the frontend)
function getAge(dateStr) {
  const birth = new Date(dateStr);
  const now = new Date();

  let age = now.getUTCFullYear() - birth.getUTCFullYear();

  const hadBirthday =
    now.getUTCMonth() > birth.getUTCMonth() ||
    (now.getUTCMonth() === birth.getUTCMonth() &&
      now.getUTCDate() >= birth.getUTCDate());

  if (!hadBirthday) age--;
  return age;
}

//? mobile number validation
const phone = z
  .string()
  .trim()
  .regex(/^01[0125]\d{8}$/);

//? check the data is validate or not
export const applicantSchema = z.object({
  fullName: z.string().trim().min(3).max(150),
  email: z.string().trim().email().max(150),
  phone: phone,
  dateOfBirth: pastDate,
  placeOfBirth: z.string().trim().min(2).max(150),
  qualification: z.string().trim().min(2).max(150),
  address: z.string().trim().min(3).max(255),
});

export const spouseSchema = z.object({
  fullName: z.string().trim().min(3).max(150),
  phone: phone,
  dateOfBirth: pastDate,
  placeOfBirth: z.string().trim().min(2).max(150),
  qualification: z.string().trim().min(2).max(150),
});

export const childSchema = z.object({
  fullName: z.string().trim().min(3).max(150),
  gender: z.enum(["ذكر", "أنثى"]),
  dateOfBirth: pastDate.refine((v) => getAge(v) < 21, "Child must be under 21"),
  placeOfBirth: z.string().trim().min(2).max(150),
});

export const createApplicationSchema = z
  .object({
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
    hasChildren: z.boolean(),
    applicant: applicantSchema,
    spouse: spouseSchema.optional(),
    children: z.array(childSchema).max(10).default([]),
  })
  .superRefine((data, ctx) => {
    //? Rule 1: spouse only when married
    if (data.maritalStatus === "married" && !data.spouse) {
      ctx.addIssue({
        code: "custom",
        path: ["spouse"],
        message: "Spouse is required",
      });
    }
    if (data.maritalStatus !== "married" && data.spouse) {
      ctx.addIssue({
        code: "custom",
        path: ["spouse"],
        message: "Spouse not allowed",
      });
    }

    //? Rule 3: a single applicant cannot have children
    if (data.maritalStatus === "single" && data.hasChildren) {
      ctx.addIssue({
        code: "custom",
        path: ["hasChildren"],
        message: "Single applicants cannot have children",
      });
    }

    //? Rule 2: children must match hasChildren
    if (data.hasChildren && data.children.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["children"],
        message: "Add at least one child",
      });
    }
    if (!data.hasChildren && data.children.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["children"],
        message: "Children not allowed",
      });
    }
  });
