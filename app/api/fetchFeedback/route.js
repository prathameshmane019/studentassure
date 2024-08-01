import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Feedback from "@/models/feedback";
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const department = searchParams.get("department");
        const _id = searchParams.get("_id");

        await connectMongoDB();

        let feedbacks;

        if (_id) {
            feedbacks = await Feedback.findOne({ _id, isActive: true });
        } else if (department) {
            feedbacks = await Feedback.find({ department });
        } else {
            feedbacks = await Feedback.find({isActive: true }).select("_id feedbackTitle"); // Fetch all feedbacks if no filters are applied
        }

        console.log("Feedback fetched Successfully");
        console.log(feedbacks);

        return NextResponse.json(feedbacks, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
    }
}