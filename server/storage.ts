import { randomUUID } from "crypto";
import { ChatMessage } from "@shared/schema";

export interface IStorage {
  createMessage(content: string, role: "user" | "assistant"): Promise<ChatMessage>;
  getMessages(): Promise<ChatMessage[]>;
  clearMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, ChatMessage>;

  constructor() {
    this.messages = new Map();
  }

  async createMessage(content: string, role: "user" | "assistant"): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: randomUUID(),
      content,
      role,
      timestamp: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async getMessages(): Promise<ChatMessage[]> {
    return Array.from(this.messages.values()).sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  async clearMessages(): Promise<void> {
    this.messages.clear();
  }
}

export const storage = new MemStorage();
