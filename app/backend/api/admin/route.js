import Event from "../../models/event";
import { connect } from "../../db";
connect();

export async function GET(request) {
  try {
    const organizers = await Event.aggregate([
      {
        $group: {
          _id: "$organizerId",
          organizerName: { $first: "$organizer" },
          email: { $first: "$contactEmail" }, 
          events: {
            $push: {
              eventId: "$_id",
              title: "$title",
              date: "$date",
              time: "$time",
              location: "$location",
              category: "$category",
              status: "$status",
              registrationCount: "$registrationCount",
              capacity: "$capacity"
            }
          },
          totalEvents: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          organizerName: 1,
          email: 1,
          events: 1,
          totalEvents: 1
        }
      },
      {
        $sort: { totalEvents: -1 }
      }
    ]);

    return new Response(JSON.stringify({
      success: true,
      count: organizers.length,
      data: organizers
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching organizers:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error fetching organizers',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}