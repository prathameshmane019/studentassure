import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Response from "@/models/response";
import Feedback from "@/models/feedback";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { feedback_id, responses } = await req.json();
        console.log(responses);

        const newResponse = new Response({
            feedback_id,
            ratings: responses,
            date: new Date()
        });
        await newResponse.save();
        console.log("Response sent successfully");
        console.log(newResponse);

        const feedback = await Feedback.findById(feedback_id);
        if (feedback) {
            if (!feedback.responses) {
                feedback.responses = [];
            }
            feedback.responses.push(newResponse._id);

            // Check if the number of responses equals the number of students
            if (feedback.responses.length === feedback.students) {
                feedback.isActive = false;
                console.log("Feedback set to inactive as all students have responded");
            }

            await feedback.save();
            console.log("Feedback updated");
        } else {
            console.error('Feedback not found for ID:', feedback_id);
            throw new Error('Feedback not found');
        }

        return NextResponse.json({ message: "Response saved successfully" });
    } catch (error) {
        // Handle errors and respond with error message
        console.error("Error saving response:", error);
        return NextResponse.json({ error: "Error saving response" }, { status: 500 });
    }
}
export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const feedbackId = searchParams.get("feedbackId");
        await connectMongoDB();
        const response = await Response.find({feedback_id:feedbackId});
        console.log(response);
        console.log("Fetched Data Successfully");
        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}