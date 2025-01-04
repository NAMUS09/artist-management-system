import { z } from "zod";

export const emailSchema = z
  .string()
  .nonempty({ message: "Email is required" })
  .email({ message: "Invalid email address" });

export const passwordSchema = z
  .string()
  .nonempty({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters");

export const phoneNumberSchema = z
  .string()
  .nonempty({ message: "Phone number is required" })
  .refine((value) => /^\d{10}$/.test(value), {
    message: "Please enter a valid 10-digit phone number",
  });

export const roleSchema = z
  .string()
  .nonempty({ message: "Role is required" })
  .refine((value) => ["super_admin", "admin", "user"].includes(value), {
    message: "Please select a valid role",
  });

export const genderSchema = z
  .string()
  .nonempty({ message: "Gender is required" })
  .refine((value) => ["male", "female", "other"].includes(value), {
    message: "Please select a valid gender",
  });

export const dobApiSchema = z
  .string()
  .nonempty({ message: "Date of birth is required" })
  .refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  }) // Ensures it's a valid date
  .refine(
    (value) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() >= birthDate.getDate());
      return age > 18 || (age === 18 && hasHadBirthdayThisYear); // Minimum age: 18
    },
    { message: "You must be at least 18 years old" }
  );

export const dobSchema = z
  .date({
    required_error: "Date of birth is required",
  })
  .refine(
    (date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() >= birthDate.getDate());
      return age > 18 || (age === 18 && hasHadBirthdayThisYear); // Minimum age: 18
    },
    { message: "You must be at least 18 years old" }
  );
