import 'dotenv/config';
import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register the same API routes used by the Node server
// We wrap in an IIFE-like init to ensure async route registration completes once
let initialized = false;
async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  await registerRoutes(app);
  initialized = true;
}

export const handler = async (event: any, context: any) => {
  await ensureInitialized();
  const wrapped = serverless(app);
  return wrapped(event, context);
};


