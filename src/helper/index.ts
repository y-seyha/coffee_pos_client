import { z } from "zod";

export const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "សូមបញ្ចូលអ៊ីមែល")
        .max(100, "អ៊ីមែលវែងពេក")
        .toLowerCase()
        .email("អ៊ីមែលមិនត្រឹមត្រូវ")
        .regex(emailRegex, "អ៊ីមែលមិនត្រឹមត្រូវ"),

    password: z
        .string()
        .min(6, "លេខសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួ")
        .max(64, "លេខសម្ងាត់វែងពេក"),
});

export  type LoginFormData = z.infer<typeof loginSchema>;

export const CATEGORIES = [
    { id: "all", name: "ទាំងអស់" },
    { id: "best-sellers", name: "លក់ដាច់បំផុត" },
    { id: 1, name: "ប្រភេទកាហ្វេ" },
    { id: 2, name: "ប្រភេទត្រជាក់" },
    { id: 3, name: "ប្រភេទក្តៅៗ" },
    { id: 4, name: "ប្រភេទអាហារសម្រន់" },
];