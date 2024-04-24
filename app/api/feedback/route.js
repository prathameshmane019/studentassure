import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Feedback from "@/models/feedback";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);

        const { feedbackTitle, subjects, selectedQuestion, students, pwd, isActive } = data;       
        console.log(selectedQuestion);
        const newFeedback = new Feedback({
            feedbackTitle,
            subjects,
            questions:selectedQuestion,
            students,
            pwd,
            isActive: isActive || false, 
        });

        await newFeedback.save();
        console.log("Feedback Created Successfully");
        console.log(newFeedback);
        return NextResponse.json({ message: "Feedback Created Successfully", feedback: newFeedback });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create feedback" });
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const feedbacks = await Feedback.find()
        console.log("Feedback fetched Successfully");
        console.log(feedbacks);
        return NextResponse.json({  feedbacks  });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create feedback" });
    }
}

