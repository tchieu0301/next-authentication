import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "@/entities/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "123456",
  database: process.env.DATABASE_NAME || "next-authentication",
  entities: [User], // Entity files
  synchronize: true, // Auto-sync DB structure (set to false in production)
  logging: false,
});

// Initialize connection
export const connectDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("✅ MariaDB Connected Successfully");
  }
  
  return AppDataSource;
};
