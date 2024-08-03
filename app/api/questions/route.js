// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/connectDb";
// import Questions from "@/models/questions";

// export async function POST(req) {
//     try {
//         await connectMongoDB();
//         const data = await req.json();
//         console.log(data);
//         const newQuestions = new Questions(data);
//         await newQuestions.save();
//         console.log("Questions added Successfully");
//         console.log(newQuestions);
//         return NextResponse.json({ message: "Questions added Successfully", Quetions: newQuestions });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: "Failed to add questions" });
//     }
// }

// export async function GET(req) {
//     try {
//         const {searchParams} = new URL(req.url);
//         const type = searchParams.get("type");
//         await connectMongoDB();

//         let questions
//         if(type){
//             if(type==="academic"){
//                 const subtype = searchParams.get("subtype");
        
//                  questions = await Questions.findOne({
//                     feedbackType:type,
//                     subType:subtype});
//                  } 
//                  if(type==="event"){
//                     questions = await Questions.findOne({
//                        feedbackType:type});
//                     }
//         }
//         else{
//             questions = await Questions.find();
//         }
//         console.log("Fetched Data Successfully", questions);
//         return NextResponse.json(questions);
//     } catch (error) {
//         console.error("Error fetching departments:", error);
//         return NextResponse.json({ error: "Failed to Fetch Departments" });
//     }
// }

// export async function DELETE(req) {
//     try {
//         await connectMongoDB();
//         const {searchParams} = new URL(req.url);
//         const _id = searchParams.get("_id");
//         const deleted = await Questions.findByIdAndDelete(_id);

//         if (!deleted) {
//             return NextResponse.json({ error: "Department not found" });
//         }

//         console.log("Department Deleted Successfully", deleted);
//         return NextResponse.json({ message: "Department Deleted Successfully" });
//     } catch (error) {
//         console.error("Error deleting department:", error);
//         return NextResponse.json({ error: "Failed to Delete" });
//     }
// }
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
        return NextResponse.json({ message: "Questions added Successfully", Questions: newQuestions });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to add questions" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        await connectMongoDB();

        let questions;
        if (type) {
            if (type === "academic") {
                const subtype = searchParams.get("subtype");
                questions = await Questions.find({
                    feedbackType: type,
                    subType: subtype
                });
            } else if (type === "event") {
                questions = await Questions.find({
                    feedbackType: type
                });
            }
        } else {
            questions = await Questions.find();
        }
        console.log("Fetched Data Successfully", questions);
        return NextResponse.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: "Failed to Fetch Questions" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");
        const deleted = await Questions.findByIdAndDelete(_id);

        if (!deleted) {
            return NextResponse.json({ error: "Question set not found" }, { status: 404 });
        }

        console.log("Question set Deleted Successfully", deleted);
        return NextResponse.json({ message: "Question set Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting question set:", error);
        return NextResponse.json({ error: "Failed to Delete" }, { status: 500 });
    }
}