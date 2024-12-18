import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { PromotorPayload } from "../custom";

export const verifyTokenPromotor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;
    if (!token) {
      throw { message: "Unauthorized!" };
    }

    // Verify the token
    const verifiedPromotor = verify(token, process.env.JWT_KEY!);
    req.promotor = verifiedPromotor as PromotorPayload;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Unauthorized!", error: err });
  }
};
