import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCVRecordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all CV records
  app.get("/api/cv-records", async (req, res) => {
    try {
      const { search, status } = req.query;
      
      let records;
      if (search || status) {
        records = await storage.searchCVRecords(
          search as string || "", 
          status as string
        );
      } else {
        records = await storage.getAllCVRecords();
      }
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV records" });
    }
  });

  // Get a specific CV record
  app.get("/api/cv-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const record = await storage.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }

      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV record" });
    }
  });

  // Create a new CV record
  app.post("/api/cv-records", async (req, res) => {
    try {
      const validatedData = insertCVRecordSchema.parse(req.body);
      const newRecord = await storage.createCVRecord(validatedData);
      res.status(201).json(newRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create CV record" });
    }
  });

  // Update a CV record
  app.put("/api/cv-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const validatedData = insertCVRecordSchema.partial().parse(req.body);
      const updatedRecord = await storage.updateCVRecord(id, validatedData);
      
      if (!updatedRecord) {
        return res.status(404).json({ message: "CV record not found" });
      }

      res.json(updatedRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update CV record" });
    }
  });

  // Delete a CV record
  app.delete("/api/cv-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const deleted = await storage.deleteCVRecord(id);
      if (!deleted) {
        return res.status(404).json({ message: "CV record not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete CV record" });
    }
  });

  // Export CV records
  app.get("/api/cv-records/export/csv", async (req, res) => {
    try {
      const { search, status } = req.query;
      
      let records;
      if (search || status) {
        records = await storage.searchCVRecords(
          search as string || "", 
          status as string
        );
      } else {
        records = await storage.getAllCVRecords();
      }

      // Generate CSV content
      const headers = ["ID", "Name", "Email", "Phone", "Position", "Department", "Experience", "Status", "Submitted"];
      const csvContent = [
        headers.join(","),
        ...records.map(record => [
          record.id,
          `"${record.name}"`,
          record.email,
          record.phone || "",
          `"${record.position}"`,
          record.department || "",
          record.experience || "",
          record.status,
          new Date(record.submittedAt).toLocaleDateString()
        ].join(","))
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=cv_records.csv");
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export CV records" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
