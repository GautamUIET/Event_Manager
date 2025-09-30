import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        status: "success",
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the token cookie - matching the same options as signup
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      expires: new Date(0), // Immediate expiration
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error.message);
    return NextResponse.json(
      { 
        status: "error",
        message: error.message || "Error while processing logout request" 
      }, 
      { status: 500 }
    );
  }
}