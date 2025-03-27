// server.js (Revised for File-Based Function Routing)

import { Elysia } from "elysia";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL  } from "node:url"; // <-- Add toFileUrl here

const port = process.env.API_PORT || 3000;
const baseApiDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "api");
const routesDir = path.join(baseApiDir, "routes");

const app = new Elysia()
  .onError(({ code, error, set }) => {
    console.error(`[API Error] Code: ${code}, Error: ${error.message}\n${error.stack}`);
    // Add specific error handling (e.g., Drizzle unique constraint)
    if (error.message?.includes("UNIQUE constraint failed")) {
        set.status = 409; // Conflict
        return { success: false, error: "Record already exists" };
    }
    set.status = 500;
    return { success: false, error: "Internal Server Error" };
  })
  .get("/api", () => ({ message: "Hello from Elysia API!" })); // Basic health check

// --- File-Based Route Loader ---

// Mapping from exported function names to HTTP methods
const methodMap = {
  get: "get",
  post: "post",
  put: "put",
  del: "delete", // Elysia uses 'delete' method name
  patch: "patch",
  // Add options, head if needed
};

async function registerRoutes(dir, basePath = "/api") {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recurse into subdirectories
        await registerRoutes(fullPath, basePath);
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
        // Process route files
        const relativePath = path.relative(routesDir, fullPath);
        const pathParts = relativePath.split(path.sep);

        // Construct the route path from file path
        let routePath = basePath;
        for (let i = 0; i < pathParts.length; i++) {
          let part = pathParts[i];
          // Remove file extension for the last part
          if (i === pathParts.length - 1) {
            part = part.replace(/\.(ts|js)$/, "");
          }
          // Skip 'index' files/segments
          if (part === "index") continue;

          // Convert [param] to :param
          part = part.replace(/\[([^\]]+)\]/g, ":$1");

          routePath += `/${part}`;
        }
        // Handle case where routePath might just be '/api' if it's routes/index.ts
        if (routePath === basePath && !relativePath.startsWith('index.')) {
            // This case should ideally not happen if index files are handled correctly
            // but as a fallback, maybe use the filename without extension
             let fileName = pathParts[pathParts.length-1].replace(/\.(ts|js)$/, "");
             if(fileName !== 'index') routePath += `/${fileName}`;
        }
         if (routePath === basePath && relativePath.startsWith('index.')) {
             // If it's the root index file (e.g. /api/routes/index.ts), path should be /api
             // If it's a subdir index (e.g. /api/routes/users/index.ts), path should be /api/users
             // The loop logic mostly handles this, ensure no trailing slash if it's just /api
         }
         // Ensure single slash for root if needed, remove trailing slash otherwise
         if (routePath !== basePath && routePath.endsWith('/')) {
             routePath = routePath.slice(0, -1);
         }
         if (routePath === '') routePath = '/'; // Should not happen with /api prefix


        try {
          const routeModule = await import(pathToFileURL(fullPath).toString()); // Use file URL for import

          for (const exportName in routeModule) {
            const handler = routeModule[exportName];
            const httpMethod = methodMap[exportName]; // Check if export name matches a method

            if (httpMethod && typeof handler === "function") {
              // Register the route with Elysia
              // Need to cast 'httpMethod' as it's dynamic
              (app[httpMethod])(routePath, handler);
              console.log(`[API] Registered: ${httpMethod.toUpperCase()} ${routePath} (from ${relativePath})`);
            }
          }
        } catch (importError) {
          console.error(`[API] Failed to import or process route ${relativePath}:`, importError);
        }
      }
    }
  } catch (err) {
    console.error(`[API] Failed to read directory ${dir}:`, err);
  }
}

console.log(`[API] Scanning for routes in: ${routesDir}`);
await registerRoutes(routesDir); // Start the recursive loading

// --- End Route Loader ---

app.listen(port);

console.log(
  `[API] Elysia server running at http://${app.server?.hostname}:${app.server?.port}`,
);
