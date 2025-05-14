import type { Message } from "./Message.js";
export type Client = (specs: Message[]) => Promise<string>;
