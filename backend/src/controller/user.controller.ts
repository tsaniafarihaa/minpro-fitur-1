import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../services/cloudinary";


export class UserController {
  async getUser(req: Request, res: Response) {
    try {
      console.log(req.user);
      const { search, page = 1 } = req.query;
      const limit = 10;
      const filter: Prisma.UserWhereInput = {};
      if (search) {
        filter.OR = [
          { username: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const countUser = await prisma.user.aggregate({ _count: { _all: true } });
      const total_page = Math.ceil(countUser._count._all / +limit);
      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { createdAt: "asc" },
        take: limit,
        skip: limit * (+page - 1),
      });
      res.status(200).send({ total_page, page, users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log("User  ID from Request:", userId);

      if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
      }

      const users = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          isVerify: true,
          percentage: true,
        },
      });

      if (!users) {
        res.status(404).json({ message: "User not found" });
        return; 
      }

      res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching users profile:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updatedUser = await prisma.user.update({
        where: { id: id || "" },
        data: req.body,
      });

      res.status(200).send("User Updated");
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(400).send("Error updating user");
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id } });
      res.status(200).send("User Deleted");
    } catch (err) {
      console.log(err);
      res.send(400).send(err);
    }
  }

  async editAvatarUser(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "file empty" };
      const { secure_url } = await cloudinaryUpload(req.file, "user_profile");

      await prisma.user.update({
        data: { avatar: secure_url },
        where: { id: req.user?.id },
      });
      res.status(200).send({ message: "avatar edited !" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
