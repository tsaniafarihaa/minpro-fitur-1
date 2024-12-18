import { Request, Response } from "express";
import { CreateEventService } from "../services/create.service";

export class CreateEventController {
  private createEventService: CreateEventService;

  constructor() {
    this.createEventService = new CreateEventService();
  }

  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const promotorId = req.promotor?.id;
      if (!promotorId) {
        res
          .status(401)
          .json({ message: "Unauthorized: Promoter ID not found" });
        return;
      }

      // Parse tickets if they're in string format
      if (typeof req.body.tickets === "string") {
        req.body.tickets = JSON.parse(req.body.tickets);
      }

      const event = await this.createEventService.createEvent(
        req.body,
        req.file,
        promotorId
      );

      res.status(201).json({
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Create event error:", errorMessage);
      res.status(500).json({
        message: "Failed to create event",
        error: errorMessage,
      });
    }
  };
}
