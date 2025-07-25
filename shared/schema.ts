import { z } from "zod";

export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(["user", "assistant"]),
  timestamp: z.date(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
