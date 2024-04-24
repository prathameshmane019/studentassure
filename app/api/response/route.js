import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Response from "@/app/models/response";
import Feedback from "@/app/models/feedback";

export async function POST(req) {
    try {
        await connectMongoDB();

        const { feedback_id, responses } = await req.json();
       
        // Format the responses array to remove null values from ratings
        console.log(responses);
        const newResponse = new Response({
            feedback_id,
            ratings: responses,
            date: new Date() 
        });
        
        await newResponse.save();

        console.log("Response sent successfully");
        console.log(newResponse);

        // Update the corresponding Feedback document with the new response ID
        const feedback = await Feedback.findById({_id:feedback_id})
        if (feedback) {
            if (!feedback.responses) {
                feedback.responses = [];
            }
            feedback.responses.push(newResponse._id);
            await feedback.save();
            console.log("Feedback updated");
        } else {
            console.error('Feedback  not found for ID:', feedback_id);
            throw new Error('User not found');
        }

        return NextResponse.json({ message: "Response saved successfully" });
    } catch (error) {
        // Handle errors and respond with error message
        console.error("Error saving response:", error);
        return NextResponse.json({ error: "Error saving response" });
    }
}
