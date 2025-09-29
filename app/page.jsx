"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import EventCard from "./components/EventCard";
import { INITIAL_EVENTS } from "./constants";

export default function Page() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [events, setEvents] = useState(INITIAL_EVENTS);

  console.log("User in Home Page:", user?.user?.role);

  // Redirect organizer to organizer page
  useEffect(() => {
    if (user?.user?.role === "organizer") {
      router.push(`/organizer`);
    }
  }, [user, router]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setEvents((prev) =>
        prev.map((e) => ({
          ...e,
          attendees: e.attendees + (Math.random() > 0.6 ? 1 : 0),
        }))
      );
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  // Simulate approval of pending registrations
  useEffect(() => {
    const approvals = setInterval(() => {
      setEvents((prev) =>
        prev.map((e) =>
          e.status === "pending" && Math.random() > 0.7
            ? { ...e, status: "approved" }
            : e
        )
      );
    }, 4000);

    return () => clearInterval(approvals);
  }, []);

  const handleRegister = (id) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id && e.status === "idle" ? { ...e, status: "pending" } : e
      )
    );
  };

  const filteredEvents = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const matchesText =
        searchText === "" ||
        e.title.toLowerCase().includes(searchText) ||
        e.description.toLowerCase().includes(searchText) ||
        e.location.toLowerCase().includes(searchText);
      return matchesCategory && matchesText;
    });
  }, [events, query, category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 text-gray-900">
      {/* Pass user to Navbar */}
      <Navbar user={user} />
      <Hero />

      <div className="my-4">
        <Filters
          query={query}
          category={category}
          onQueryChange={setQuery}
          onCategoryChange={setCategory}
        />
      </div>

      <section id="events" className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onRegister={handleRegister} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
            No events match your search.
          </div>
        )}
      </section>
    </div>
  );
}
