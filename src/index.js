import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const app = express();
app.use(express.json());

const client = new PrismaClient();
app.post("/users", async (req, res) => {
  try {
    //    const firstName = req.body.firstName;
    //    const lastName = req.body.lastName;
    //    const emailAddress = req.body.emailAddress;
    //    const userName = req.body.userName;
    //    const password = req.body.password;
    const { firstName, lastName, emailAddress, userName, password } = req.body;
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
    res.status(500).json({ message: "something went wrong please try again." });
  }
});

app.listen(4000, () => console.log("server running on port 4000..."));
