import path from "path";
import { createServer } from "./index"; // Imports our function from index.ts
import * as express from "express";

// --- THE FIX IS HERE ---
// Use object destructuring to get the Express app instance from the returned object.
const { app } = createServer();
// Now, the 'app' variable correctly holds the Express application.

const port = process.env.PORT || 5000;

// Get the absolute path to the built frontend assets.
// Using process.cwd() is more reliable for finding the project root.
const distPath = path.resolve(process.cwd(), 'dist/spa');

// Serve all static files (CSS, JS, images) from the 'dist/spa' folder.
app.use(express.static(distPath));

// This is the "catch-all" route for client-side routing.
// It ensures that if you refresh the page on a URL like /profile, React Router handles it.
app.get("*", (req, res) => {
  // We check to make sure the request is not for an API endpoint.
  // The API routes are already handled by the app instance we created.
  if (req.originalUrl.startsWith('/api')) {
    // If an API route is not found by this point, it's a 404.
    return res.status(404).json({ message: "API endpoint not found" });
  }
  
  // For any other request, serve the main HTML file of your single-page application.
  res.sendFile(path.resolve(distPath, "index.html"));
});

// Start listening for requests on the specified port.
app.listen(port, () => {
  console.log(`🚀 Production server is running on http://localhost:${port}`);
});

// --- Graceful Shutdown (Good Practice) ---
const shutdown = (signal: string) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully`);
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));