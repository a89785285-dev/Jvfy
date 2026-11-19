import "dotenv/config";
import express from "express";
import { configureApp } from "./server/_core/index";

// Vercel detects this root-level Express entrypoint and serves its routes as one Function.
const app = configureApp(express());

export default app;
