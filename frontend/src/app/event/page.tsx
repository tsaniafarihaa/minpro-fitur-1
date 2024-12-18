"use client";

import { useState, useEffect } from "react";
import EventFilter from "@/components/event/EventFilter";
import EventGrid from "@/components/event/EventGrid";
import { Event } from "@/types/event";

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: "",
    priceRange: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/events");
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    let filtered = [...events];

    if (newFilters.category) {
      filtered = filtered.filter(
        (event) => event.category === newFilters.category
      );
    }
    if (newFilters.location) {
      filtered = filtered.filter(
        (event) => event.location === newFilters.location
      );
    }
    if (newFilters.date) {
      // Add date filtering logic based on your needs
    }
    if (newFilters.priceRange) {
      // Add price range filtering logic
    }

    setFilteredEvents(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Events</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <EventFilter
              currentFilters={filters}
              onFilterChange={applyFilters}
            />
          </aside>
          <main className="lg:w-3/4">
            <EventGrid events={filteredEvents} />
          </main>
        </div>
      </div>
    </div>
  );
}
