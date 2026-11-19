import "dotenv/config";
import express from "express";
import { configureApp } from "./index";

const app = configureApp(express());
const port = Number.parseInt(process.env.PORT || "3000", 10);

const server = app.listen(port, () => {
  console.log("[api] server listening");
});

server.on("error", (error) => {
  console.error("[api] server failed to start", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
