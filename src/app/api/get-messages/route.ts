import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    // Log session information for debugging
    console.log("Session data:", JSON.stringify(session?.user, null, 2));

    if (!session || !session.user) {
      console.log("No session or user found");
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const user = session.user as User & { _id?: string };

    if (!user._id) {
      console.log("No user ID found in session");
      return Response.json(
        {
          success: false,
          message: "User ID not found in session",
        },
        { status: 400 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    console.log("Looking for messages with userId:", user._id);

    // Aggregating Pipelines
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$message", preserveNullAndEmptyArrays: true } },
      { $sort: { "message.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$message" } } },
    ]);

    // Handle case where user exists but has no messages
    if (!userMessages || userMessages.length === 0) {
      // Check if user exists at all
      const userExists = await UserModel.findById(userId);
      if (!userExists) {
        console.log("User not found in database");
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 }
        );
      }

      // User exists but has no messages
      console.log("User found but has no messages");
      return Response.json(
        {
          success: true,
          messages: [],
        },
        { status: 200 }
      );
    }

    console.log("Successfully retrieved messages");
    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error processing request",
      },
      { status: 500 }
    );
  }
}
