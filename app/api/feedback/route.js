import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Feedback from "@/models/feedback";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
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
        const {searchParams}= new URL(req.url);
        const department = searchParams.get("department");
    
        await connectMongoDB();
        let feedbacks
        
         feedbacks = await Feedback.find({department:department})
        console.log("Feedback fetched Successfully");
        console.log(feedbacks);
        return NextResponse.json(feedbacks,{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create feedback" },{status:500});
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const {searchParams} = new URL(req.url);
        const _id = searchParams.get("_id");
        const deleted = await Feedback.findByIdAndDelete(_id);

        if (!deleted) {
            return NextResponse.json({ error: "Feedback not found" },{status:404});
        }
        console.log("Feedback Deleted Successfully", deleted);
        return NextResponse.json({ message: "Feedback Deleted Successfully" },{status:200});
    } catch (error) {
        console.error("Error deleting Feedback:", error);
        return NextResponse.json({ error: "Failed to Delete" },{status:500});
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

