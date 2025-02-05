import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();
  const _req = await req.json();
  // console.log(_req)
  try {
    const { fullName, email, password } = _req;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          err: "Email already exists",
        },
        { status: 409 }
      );
    } else {
      await new User({
        fullName,
        email,
        password: await bcrypt.hash(password, 10),
      }).save();
      return NextResponse.json({
        success: "Registration successful.",
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { err: "Server error. Try again." },
      { status: 500 }
    );
  }
}
