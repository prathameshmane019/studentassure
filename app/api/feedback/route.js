import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Feedback from "@/models/feedback";
import Response from "@/models/response";
export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        if(!data.department){
            return NextResponse.json({ message: "Department missing"},{status:400});
        }
        console.log(data);    
        const newFeedback = new Feedback(data);
        await newFeedback.save();
        console.log("Feedback Created Successfully");
        console.log(newFeedback);
        return NextResponse.json({ message: "Feedback Created Successfully", feedback: newFeedback });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create feedback" });
    }
}
export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const department = searchParams.get("department");
   
        await connectMongoDB();
        
        const feedbacks = await Feedback.aggregate([
            { $match: { department: department } },
            { $project: {
                feedbackTitle: 1,
                isActive: 1,
                students: 1,
                responseCount: { $size: "$responses" }
            }}
        ]);

        console.log("Feedback fetched Successfully");
        console.log(feedbacks);
        return NextResponse.json(feedbacks, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch feedback" }, {status: 500});
    }
}
export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("_id");

        // Find the feedback first
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        // Delete all associated responses
        await Response.deleteMany({ feedback_id: id });

        // Now delete the feedback
        const deleted = await Feedback.findByIdAndDelete(id);

        console.log("Feedback and associated responses deleted successfully", deleted);
        return NextResponse.json({ message: "Feedback and associated responses deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting Feedback and responses:", error);
        return NextResponse.json({ error: "Failed to Delete" }, { status: 500 });
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

