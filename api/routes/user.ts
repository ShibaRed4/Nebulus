// api/routes/user.ts

import { db } from "../db";
import * as schema from '../db/schema'

export async function get({}) { // Consider renaming if it's not really a GET operation
    console.log("Attempting to insert user...");
    try {
        // Let the database generate the ID automatically
        const result = await db.insert(schema.users).values({
            // id: Math.random(), // <-- REMOVE THIS LINE
            username: "Hello"
        }).returning(); // Add .returning() to get the inserted row back

        console.log("Insert successful:", result);
        // Drizzle insert().returning() returns an array
        return { success: true, data: result[0] };

    } catch (error) {
        console.error("Error during user insert:", error);
        // You might want to re-throw or return a specific error response
        // Consider using set.status = 500 from Elysia context if passed in
        return { success: false, error: "Failed to insert user" };
    }
}
