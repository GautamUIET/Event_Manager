import Registration from "../../models/registerEvent";
import Event from "../../models/event";
import { connect } from "../../db";
connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';

    // Build match conditions for search
    const matchConditions = {};
    if (search) {
      matchConditions.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) {
      matchConditions.department = { $regex: department, $options: 'i' };
    }

    // Get students with their registrations
    const students = await Registration.aggregate([
      {
        $group: {
          _id: "$userId",
          studentId: { $first: "$studentId" },
          name: { $first: "$name" },
          email: { $first: "$email" },
          phone: { $first: "$phone" },
          department: { $first: "$department" },
          totalRegistrations: { $sum: 1 },
          firstRegistration: { $min: "$registrationDate" },
          lastRegistration: { $max: "$registrationDate" },
          eventIds: { $push: "$eventId" }
        }
      },
      {
        $match: matchConditions
      },
      {
        $lookup: {
          from: "events",
          localField: "eventIds",
          foreignField: "_id",
          as: "registeredEvents"
        }
      },
      {
        $project: {
          _id: 1,
          studentId: 1,
          name: 1,
          email: 1,
          phone: 1,
          department: 1,
          totalRegistrations: 1,
          firstRegistration: 1,
          lastRegistration: 1,
          registeredEvents: {
            $map: {
              input: "$registeredEvents",
              as: "event",
              in: {
                eventId: "$$event._id",
                title: "$$event.title",
                date: "$$event.date",
                time: "$$event.time",
                location: "$$event.location",
                category: "$$event.category",
                status: "$$event.status",
                organizer: "$$event.organizer"
              }
            }
          }
        }
      },
      {
        $sort: { totalRegistrations: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);

    // Get total count for pagination
    const totalStudentsAggregate = await Registration.aggregate([
      {
        $group: {
          _id: "$userId",
          studentId: { $first: "$studentId" },
          name: { $first: "$name" },
          email: { $first: "$email" },
          department: { $first: "$department" }
        }
      },
      {
        $match: matchConditions
      },
      {
        $count: "total"
      }
    ]);

    const totalStudents = totalStudentsAggregate[0]?.total || 0;

    return new Response(JSON.stringify({
      success: true,
      data: students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents: totalStudents,
        hasNext: page * limit < totalStudents,
        hasPrev: page > 1
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error fetching students',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}