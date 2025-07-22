import { db } from "./db";
import { userProfiles } from "@shared/schema";

export async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    
    // Simple connection test
    const result = await db.select().from(userProfiles).limit(1);
    console.log("✅ Database connection successful!");
    return true;
  } catch (error: any) {
    console.log("❌ Database connection failed:", error.message);
    return false;
  }
}