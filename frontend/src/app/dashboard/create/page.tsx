"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

type EventForm = {
  title: string;
  category: string;
  location: string;
  venue: string;
  description: string;
  date: string;
  time: string;
  eventType: "free" | "paid";
  bannerImage?: FileList;
};

type TicketType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CreateEventPage() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<EventForm>();

  const eventType = watch("eventType", "free");

  useState(() => {
    if (eventType === "free") {
      setTicketTypes([{ id: "free", name: "Free", price: 0, quantity: 1 }]);
    } else {
      setTicketTypes([]);
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("bannerImage", e.target.files as FileList);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { id: Date.now().toString(), name: "", price: 0, quantity: 0 },
    ]);
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: string | number
  ) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setTicketTypes(updatedTickets);
  };

  // Bagian handleSubmit di form
  const onSubmit = async (data: EventForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("location", data.location);
      formData.append("venue", data.venue);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("time", data.time);

      // Update format tiket
      const formattedTickets = ticketTypes.map((ticket) => ({
        category: ticket.name, // pastikan ini sesuai dengan yang diharapkan backend
        price: Number(ticket.price),
        quantity: Number(ticket.quantity),
      }));

      console.log("Tickets being sent:", formattedTickets);
      formData.append("tickets", JSON.stringify(formattedTickets));

      if (data.bannerImage?.[0]) {
        formData.append("banner", data.bannerImage[0]);
      }

      // Log semua data yang akan dikirim
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const response = await fetch("http://localhost:8000/api/events/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error);
      }

      alert("Event created successfully!");
      reset();
      setImagePreview("");
      setTicketTypes([{ id: "free", name: "Free", price: 0, quantity: 1 }]);
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "An error occurred while creating the event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-orange-500 mb-8 text-center">
            Create New Event
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Banner Upload */}
            <div>
              <label className="block mb-2 font-medium">Event Banner</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={200}
                  />
                ) : (
                  <span className="text-gray-500">No image selected</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Event Title</label>
                <input
                  {...register("title")}
                  placeholder="Enter Event Title"
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  {...register("category")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                >
                  <option value="Music">Music</option>
                  <option value="Orchestra">Orchestra</option>
                  <option value="Opera">Opera</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <select
                  {...register("location")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                >
                  <option value="Bandung">Bandung</option>
                  <option value="Bali">Bali</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Jakarta">Jakarta</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Venue</label>
                <input
                  {...register("venue")}
                  placeholder="Enter Venue"
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Time</label>
                <input
                  type="time"
                  {...register("time")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                {...register("description")}
                placeholder="Enter Event Description"
                className="p-3 bg-zinc-800 rounded-lg w-full h-32"
                required
              />
            </div>

            {/* Tickets */}
            <div>
              <h2 className="text-lg font-bold mb-2 text-orange-500">
                Tickets
              </h2>
              {eventType === "free" ? (
                <div className="grid grid-cols-2 gap-4 p-3 bg-zinc-800 rounded-lg">
                  <div>
                    <label className="block mb-1 font-medium">
                      Ticket Name
                    </label>
                    <input
                      value="Free"
                      disabled
                      className="p-3 bg-zinc-700 rounded-lg w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Quantity</label>
                    <input
                      type="number"
                      value={ticketTypes[0]?.quantity || 1}
                      onChange={(e) =>
                        handleTicketChange(
                          0,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="p-3 bg-zinc-700 rounded-lg w-full"
                      min="1"
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  {ticketTypes.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="grid grid-cols-3 gap-4 mb-2"
                    >
                      <input
                        type="text"
                        placeholder="Ticket Name"
                        value={ticket.name}
                        onChange={(e) =>
                          handleTicketChange(index, "name", e.target.value)
                        }
                        className="p-3 bg-zinc-800 rounded-lg"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={ticket.price}
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "price",
                            parseInt(e.target.value)
                          )
                        }
                        className="p-3 bg-zinc-800 rounded-lg"
                        min="0"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={ticket.quantity}
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        className="p-3 bg-zinc-800 rounded-lg"
                        min="1"
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTicketType}
                    className="px-4 py-2 bg-orange-500 rounded-lg text-white mt-2"
                  >
                    Add Ticket Type
                  </button>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 py-3 rounded-lg text-white font-medium hover:bg-orange-600 transition-colors"
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
