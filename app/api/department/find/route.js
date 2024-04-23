import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Department from "@/models/department";
export async function GET() {
    try {
        await connectMongoDB();
        const department = await Department.find();
        console.log(department);
        console.log("Fetched Data Successfully");
        return NextResponse.json(department);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}
