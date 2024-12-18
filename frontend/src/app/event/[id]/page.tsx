"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function EventDetail() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/${params.id}`
        );
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEventDetail();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-[400px] bg-gray-700 rounded-xl mb-8"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-gray-700 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl text-white">Event not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src={event.thumbnail || "/defaultEventImage.jpg"}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <p className="text-gray-400 mb-6">{event.description}</p>

            <div className="space-y-4 text-white">
              <div>
                <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                <p>
                  <span className="text-gray-400">Date:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-gray-400">Time:</span>{" "}
                  {new Date(event.time).toLocaleTimeString()}
                </p>
                <p>
                  <span className="text-gray-400">Venue:</span> {event.venue}
                </p>
                <p>
                  <span className="text-gray-400">Location:</span>{" "}
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl h-fit">
            <h2 className="text-xl font-semibold text-white mb-4">Tickets</h2>
            {event.tickets.map((ticket: any) => (
              <div
                key={ticket.id}
                className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-white font-medium">{ticket.category}</p>
                  <p className="text-sm text-gray-400">
                    {ticket.quantity} available
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    IDR {ticket.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg mt-6 hover:bg-orange-600 transition-colors">
              Buy Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
