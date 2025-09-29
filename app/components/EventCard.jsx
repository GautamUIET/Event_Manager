"use client";

import StatusButton from "./status_button";
import AttendeeBadge from "./AttendeeBadge";

export default function EventCard({ event, onRegister }) {
	return (
		<div className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
			<AttendeeBadge count={event.attendees} />
			<div className="mb-2 flex items-start justify-between gap-3">
				<h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
			</div>
			<div className="mt-1 space-y-1 text-sm text-gray-600">
				<p className="flex items-center gap-2"><span className="inline-flex h-2 w-2 rounded-full bg-gray-400"></span>{event.dateTime}</p>
				<p className="flex items-center gap-2"><span className="inline-flex h-2 w-2 rounded-full bg-gray-400"></span>{event.location}</p>
			</div>
			<p className="mt-3 line-clamp-2 text-sm text-gray-700">{event.description}</p>
			<div className="mt-4">
				<StatusButton status={event.status} onRegister={() => onRegister(event.id)} />
			</div>
		</div>
	);
}


