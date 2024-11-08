import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createBlog(req, res) {
  try {
    const { title, excerpt, body, featuredImage } = req.body;
    const userId = req.userId; // Get the user ID from the request

    // Create a new blog with the provided data and userId as owner
    const newBlog = await prisma.blog.create({
      data: {
        title,
        excerpt,
        body,
        featuredImage,
        owner: userId, // Store userId as owner (a String)
      },
    });

    // Respond with the newly created blog
    res.status(201).json(newBlog);
  } catch (e) {
    console.error("Error creating blog:", e); // Log error for debugging
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
}
