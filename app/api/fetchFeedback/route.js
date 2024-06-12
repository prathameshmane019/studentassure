import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Feedback from "@/models/feedback";
export async function GET(req) {
    try {
        await connectMongoDB();
        const feedbacks = await Feedback.find({
            isActive: true,
            $expr: { $lt: [{ $size: "$responses" }, "$students"] }
        });
        console.log("Fetched Feedbacks Successfully:", feedbacks);
        return NextResponse.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return NextResponse.json({ error: "Error fetching feedbacks" });
    }
}