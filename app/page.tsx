import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

// 🔥 Build a proper BASE_URL that works everywhere
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL; // e.g., https://eventra-red.vercel.app
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development fallback
  return "http://localhost:3000";
};

const Page = async () => {
  "use cache";
  cacheLife("hours");

  const baseUrl = getBaseUrl();

  // ✅ Always use a valid absolute URL at build time
  const response = await fetch(`${baseUrl}/api/events`);
  console.log(response);
  if (!response.ok) {
    console.error("Failed to fetch events:", response.statusText);
    return (
      <section className="pt-10 text-center">
        <h1 className="text-red-500">Error fetching events</h1>
      </section>
    );
  }

  const { events } = await response.json();

  return (
    <section className="pt-10">
      <h1 className="text-center">
        The Hub for Every <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Concerts, Tech Events, Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event._id?.toString?.() ?? event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
