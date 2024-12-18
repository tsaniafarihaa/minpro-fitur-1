// eventval.ts (continued)
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateCreateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string()
      .valid("Music", "Orchestra", "Opera", "Other")
      .required(),
    location: Joi.string()
      .valid("Bandung", "Bali", "Surabaya", "Jakarta")
      .required(),
    venue: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    tickets: Joi.array()
      .items(
        Joi.object({
          category: Joi.string().required(), // ubah dari name ke category
          price: Joi.number().required(),
          quantity: Joi.number().required(),
        })
      )
      .required(),
  });

  // Tambahkan logging untuk debug
  console.log(
    "Received body for validation:",
    JSON.stringify(req.body, null, 2)
  );

  const { error } = schema.validate(req.body);
  if (error) {
    console.log("Validation error:", error.details);
    res.status(400).json({
      message: "Validation error",
      error: error.details[0].message,
    });
    return;
  }
  next();
};
