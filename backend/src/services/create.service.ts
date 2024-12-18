import prisma from "../prisma";
import { cloudinaryUpload } from "./cloudinary";

export class CreateEventService {
  async createEvent(
    data: any,
    file?: Express.Multer.File,
    promotorId?: string
  ) {
    try {
      console.log("Received data:", data);
      console.log("Received file:", file);
      console.log("Received promotorId:", promotorId);

      let thumbnailUrl: string | undefined;

      if (file) {
        const result = await cloudinaryUpload(file, "events");
        thumbnailUrl = result.secure_url;
      }

      // Validate and format the date and time
      const eventDate = new Date(data.date);
      const [hours, minutes] = data.time.split(":");
      const eventTime = new Date();
      eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const event = await prisma.event.create({
        data: {
          title: data.title,
          category: data.category,
          location: data.location,
          venue: data.venue,
          description: data.description,
          date: eventDate,
          time: eventTime,
          thumbnail: thumbnailUrl,
          promotorId,
          tickets: {
            create: data.tickets.map((ticket: any) => ({
              category: ticket.category,
              price: ticket.price,
              quantity: ticket.quantity,
            })),
          },
        },
        include: {
          tickets: true,
        },
      });

      return event;
    } catch (error) {
      console.error("Detailed error in CreateEventService:", error);
      throw error;
    }
  }
}
