"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import Navbar from "./components/Navbar";

export default function EventRegistration({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    department: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock event data
  const event = {
    id: params?.id || "1",
    title: "Annual Tech Symposium 2024",
    description:
      "Join us for the biggest technology conference of the year featuring industry experts, workshops, and networking opportunities.",
    date: "2024-12-15",
    time: "9:00 AM - 5:00 PM",
    location: "University Main Auditorium",
    category: "Technology",
    attendees: 247,
    capacity: 300,
    organizer: "Tech Students Association",
    requirements: ["Student ID", "Laptop recommended for workshops"],
    price: "Free"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Registration data:", { ...formData, eventId: event.id });

    setIsSubmitting(false);
    router.push("/registration-success");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 text-gray-900">
      {/* <Navbar /> */}

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details - Left */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {event.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.attendees}/{event.capacity} attendees
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h1>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{event.date}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">{event.time}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{event.location}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">Organizer:</span>
                    <span className="ml-2">{event.organizer}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <span className="font-medium">Price:</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      {event.price}
                    </span>
                  </div>
                </div>

                {event.requirements && event.requirements.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Requirements:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Registration Form - Right */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Event Registration
              </h2>
              <p className="text-gray-600 mt-2">
                Complete the form below to register for this event
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {["name", "email", "phone", "studentId"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field === "name"
                      ? "Full Name *"
                      : field === "studentId"
                      ? "Student ID *"
                      : field === "email"
                      ? "Email Address *"
                      : "Phone Number *"}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    id={field}
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select your department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Business Administration">
                    Business Administration
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-800 mb-2">
                  Registration Summary
                </h3>
                <div className="flex justify-between text-sm text-indigo-700">
                  <span>Event:</span>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex justify-between text-sm text-indigo-700 mt-1">
                  <span>Price:</span>
                  <span className="font-medium">{event.price}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing Registration..." : "Complete Registration"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to our terms and conditions. You'll
                receive a confirmation email shortly.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
