import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Department from "@/models/department";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();

        const { department, username, password, classes } = data;
console.log(data);
        const newDepartment = new Department({
            department,
            classes: classes, // Convert comma-separated string to array
            _id: username, // Use username as the document ID
            password
        });

        await newDepartment.save();
        console.log("Department Registered Successfully", newDepartment);
        return NextResponse.json({ message: "Department Registered Successfully", department: newDepartment });
    } catch (error) {
        console.error("Error creating department:", error);
        return NextResponse.json({ error: "Failed to Register" });
    }
}

export async function PUT(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
console.log(data);
        const { username, department, password, classes } = data;

        const existingDepartment = await Department.findByIdAndUpdate({_id:username}, {
            department,
            classes: classes, // Convert comma-separated string to array
            password
        }, { new: true });
console.log(existingDepartment);
        if (!existingDepartment) {
            return NextResponse.json({ error: "Department not found" });
        }

        console.log("Department Updated Successfully", existingDepartment);
        return NextResponse.json({ message: "Department Updated Successfully", department: existingDepartment });
    } catch (error) {
        console.error("Error updating department:", error);
        return NextResponse.json({ error: "Failed to Update" });
    }
}


export async function GET() {
    try {
        await connectMongoDB();
        const departments = await Department.find();

        console.log("Fetched Data Successfully", departments);
        return NextResponse.json(departments);
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
        const deletedDepartment = await Department.findByIdAndDelete(_id);

        if (!deletedDepartment) {
            return NextResponse.json({ error: "Department not found" });
        }

        console.log("Department Deleted Successfully", deletedDepartment);
        return NextResponse.json({ message: "Department Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting department:", error);
        return NextResponse.json({ error: "Failed to Delete" });
    }
}
