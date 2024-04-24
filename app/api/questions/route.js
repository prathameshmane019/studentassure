import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Questions from "@/models/questions";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);
        const newQuestions = new Questions(data);
        await newQuestions.save();
        console.log("Questions added Successfully");
        console.log(newQuestions);
        return NextResponse.json({ message: "Questions added Successfully", Quetions: newQuestions });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to add questions" });
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const question = await Questions.find();

        console.log("Fetched Data Successfully", question);
        return NextResponse.json(question);
    } catch (error) {
        console.error("Error fetching departments:", error);
        return NextResponse.json({ error: "Failed to Fetch Departments" });
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const {searchParams} = new URL(req.url);
        const _id = searchParams.get("_id");
        const deleted = await Questions.findByIdAndDelete(_id);

        if (!deleted) {
            return NextResponse.json({ error: "Department not found" });
        }

        console.log("Department Deleted Successfully", deleted);
        return NextResponse.json({ message: "Department Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting department:", error);
        return NextResponse.json({ error: "Failed to Delete" });
    }
}
