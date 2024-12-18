import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserPayload } from "../custom";

export const verifyTokenUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const token = req.cookies?.token;
    if (!token) {
      throw { message: "Unauthorized!" };
    }

    // Verify the token
    const verifiedUser = verify(token, process.env.JWT_KEY!);
    req.user = verifiedUser as UserPayload;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Unauthorized!", error: err });
  }
};
