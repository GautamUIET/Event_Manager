// app/backend/api/registrations/request/route.js
import Registration from "../../models/registerEvent";
import Event from "../../models/event";
import { connect } from "../../db";
import { NextResponse } from "next/server";

connect();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      eventId,
      studentId,
      userId,
      name,
      email,
      phone,
      department
    } = body;

    // Validate required fields
    const requiredFields = { eventId, studentId, userId, name, email };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if event is published
    if (event.status !== 'published') {
      return NextResponse.json(
        { error: "Event is not available for registration" },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      $or: [{ studentId }, { userId }]
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // Check event capacity
    const approvedRegistrations = await Registration.countDocuments({
      eventId,
      status: 'approved'
    });

    if (approvedRegistrations >= event.capacity) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    // Create registration request
    const registration = await Registration.create({
      eventId,
      studentId,
      userId,
      name: name.trim(),
      email: email.toLowerCase(),
      phone,
      department,
      status: 'pending' // Default status is pending
    });

    // Populate with event details for response
    const populatedRegistration = await Registration.findById(registration._id)
      .populate('eventId', 'title organizer organizerId date location');

    return NextResponse.json(
      {
        status: "success",
        message: "Registration request submitted successfully",
        data: {
          registration: populatedRegistration
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating registration request:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Error while creating registration request" },
      { status: 500 }
    );
  }
}