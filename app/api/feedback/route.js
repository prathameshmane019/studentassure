import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Feedback from "@/models/feedback";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);

        const { feedbackTitle, subjects, selectedQuestion, students, pwd, isActive,department } = data;       
        console.log(selectedQuestion);
        const newFeedback = new Feedback({
            feedbackTitle,
            subjects,
            questions:selectedQuestion,
            students,
            pwd,
            department,
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

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const {searchParams} = new URL(req.url);
        const _id = searchParams.get("_id");
        const deleted = await Feedback.findByIdAndDelete(_id);

        if (!deleted) {
            return NextResponse.json({ error: "Feedback not found" });
        }
        console.log("Feedback Deleted Successfully", deleted);
        return NextResponse.json({ message: "Feedback Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting Feedback:", error);
        return NextResponse.json({ error: "Failed to Delete" });
    }
}
export async function PUT(req) {
    try {
        await connectMongoDB();
        const {searchParams} = new URL(req.url);
        const _id = searchParams.get("_id");
        const { isActive } = await req.json();

        const updatedFeedback = await Feedback.findByIdAndUpdate(_id, { isActive }, { new: true });

        if (!updatedFeedback) {
            return NextResponse.json({ error: "Feedback not found" });
        }

        console.log("Feedback Updated Successfully", updatedFeedback);
        return NextResponse.json({ message: "Feedback Updated Successfully", feedback: updatedFeedback });
    } catch (error) {
        console.error("Error updating Feedback:", error);
        return NextResponse.json({ error: "Failed to update feedback" });
    }
}

