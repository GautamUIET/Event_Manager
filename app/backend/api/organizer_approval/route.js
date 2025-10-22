// app/backend/api/registrations/request/route.js
import Registration from "../../models/registerEvent";
import Event from "../../models/event";
import { connect } from "../../db";
import { NextResponse } from "next/server";

connect();

export async function POST(req) {
  try {
    const body = await req.json();
    const { registrationId, action, rejectionReason = '' } = body;
    const organizerId = body.organizerId; // From authenticated user

    if (!registrationId || !action) {
      return NextResponse.json(
        { error: "Registration ID and action are required" },
        { status: 400 }
      );
    }

    // Find registration
    const registration = await Registration.findById(registrationId)
      .populate('eventId');

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Check if organizer owns the event
    if (registration.eventId.organizerId.toString() !== organizerId) {
      return NextResponse.json(
        { error: "Unauthorized to manage this registration" },
        { status: 403 }
      );
    }

    if (action === 'approve') {
      // Check event capacity
      const approvedCount = await Registration.countDocuments({
        eventId: registration.eventId._id,
        status: 'approved'
      });

      if (approvedCount >= registration.eventId.capacity) {
        return NextResponse.json(
          { error: "Event is already full" },
          { status: 400 }
        );
      }

      // Approve registration
      registration.status = 'approved';
      registration.approvedAt = new Date();
      registration.rejectionReason = '';
      await registration.save();

      // Update event registration count
      await Event.findByIdAndUpdate(registration.eventId._id, {
        $inc: { registrationCount: 1 }
      });

      return NextResponse.json({
        status: "success",
        message: "Registration approved successfully",
        data: { registration }
      });

    } else if (action === 'reject') {
      // Reject registration
      registration.status = 'rejected';
      registration.rejectedAt = new Date();
      registration.rejectionReason = rejectionReason;
      await registration.save();

      return NextResponse.json({
        status: "success",
        message: "Registration rejected successfully",
        data: { registration }
      });

    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error processing registration:", error);
    return NextResponse.json(
      { error: error.message || "Error processing registration" },
      { status: 500 }
    );
  }
}