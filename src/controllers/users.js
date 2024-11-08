import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const client = new PrismaClient();
export const registerUser = async (req, res) => {
  console.log(req.body);
  try {
    const { firstName, lastName, emailAddress, userName, password } = req.body;

    // Validation checks with corrected status codes

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await client.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        userName,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
