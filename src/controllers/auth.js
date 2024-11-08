import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const loginUser = async (req, res) => {
  try {
    //read the email address and the plain password from the client/user
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    //send the token to the client as a cookie
    res.status(200).cookie("authToken", token, { httpOnly: true }).json(user);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
