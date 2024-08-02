import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Feedback from "@/models/feedback";

export async function GET(req) {
    try {
        const {searchParams}= new URL(req.url);
        const department = searchParams.get("department");
    
        await connectMongoDB();
        let feedbacks
         feedbacks = await Feedback.find({department, isActive:false})
        console.log("Feedback fetched Successfully");
        console.log(feedbacks);
        return NextResponse.json(feedbacks,{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create feedback" },{status:500});
    }
}
