import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
async function validateUserInformation(req, res, next) {
  const { firstName, lastName, emailAddress, userName, password } = req.body;
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
  next();
}

export default validateUserInformation;
