import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

const client = new PrismaClient();

app.post("/users", async (req, res) => {
  console.log(req.body);
  try {
    const { firstName, lastName, emailAddress, userName, password } = req.body;

    // Validation checks with corrected status codes
    if (!firstName) {
      res.status(400).json({ message: "First name is required" });
      return;
    }
    if (!lastName) {
      res.status(400).json({ message: "Last name is required" });
      return;
    }
    if (!emailAddress) {
      res.status(400).json({ message: "Email address is required" });
      return;
    }
    if (!userName) {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    // Check if email already exists in the database
    const userWithEmail = await client.user.findFirst({
      where: { emailAddress },
    });
    if (userWithEmail) {
      res.status(400).json({ message: "Email address already taken" });
      return;
    }

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
});

app.post("/auth/login", async (req, res) => {
  try {
    //read the email address and the plain password from the client/user
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;
    console.log("Email is ${emailAddress} and password is ${password}");
    //check if the user exists:querying the database against the email
    const user = await client.user.findFirst({
      where: { emailAddress: emailAddress },
    });
    //if the user does not exist; authentication failure
    if (!user) {
      res.status(401).json({ message: "Wrong email address or password" });
      return;
    }
    //if  the user exists, compare the plain text password given against the hashed password
    const passwordsMatch = await bcrypt.compare(password, user.password);

    //if they dont match ,authentication failure
    if (passwordsMatch === false) {
      res.status(401).json({ message: "Wrong email address or password" });
      return;
    }

    //if they match,generate a token,save the id in there

    const token = jwt.sign(user, process.env.JWT_SECRET);

    //send the token to the client as a cookie
    res.status(200).cookie("authToken", token, { httpOnly: true }).json(user);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

app.listen(4000, () => console.log("Server running on port 4000..."));
