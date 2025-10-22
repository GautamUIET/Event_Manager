// app/backend/api/registrations/request/route.js
import Registration from "../../models/registerEvent";
import Event from "../../models/event";
import { connect } from "../../db";
import { NextResponse } from "next/server";

connect();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get('organizerId');
    
    if (!organizerId) {
      return NextResponse.json(
        { error: "Organizer ID is required" },
        { status: 400 }
      );
    }

    // Get all events by this organizer
    const organizerEvents = await Event.find({ organizerId }).select('_id');
    const eventIds = organizerEvents.map(event => event._id);

    // Get pending registrations for these events
    const pendingRegistrations = await Registration.find({
      eventId: { $in: eventIds },
      status: 'pending'
    })
    .populate('eventId', 'title date time location capacity')
    .sort({ createdAt: -1 });

    return NextResponse.json({
      status: "success",
      data: {
        pendingRequests: pendingRegistrations,
        count: pendingRegistrations.length
      }
    });

  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching pending requests" },
      { status: 500 }
    );
  }
}