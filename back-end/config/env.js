import { config } from "dotenv";

config({ path: ".env" });

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
