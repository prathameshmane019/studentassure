import { connectMongoDB } from "@/lib/connectDb";
import Department from '@/models/department';
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { identifier, newPassword, oldPassword } = await req.json();
  console.log(identifier);
  try {
    await connectMongoDB();

    const user = await Department.findOne({ _id: identifier});

    if (!user) {
      console.error('User not found for identifier:', identifier);
      return NextResponse.json({ message: 'User not found' },{ status: 404 });
    }

    if (oldPassword && user.password !== oldPassword) {
        console.log(user);
      console.error('Old password does not match for user:', user._id);
      return NextResponse.json({ message: 'Old password is incorrect' },{ status: 404 });
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' },{ status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Internal server error' },{ status: 500 });
  }
}
