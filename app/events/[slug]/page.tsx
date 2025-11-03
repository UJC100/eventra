import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const EventDetailItem = ({icon, alt, label}: {icon: string; alt: string, label: string}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>{label}</p>
  </div>
)

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {
        agendaItems.map(item => (
          <li key={item}>{item}</li>
        ))
      }
    </ul>
  </div>
)

const EventTags = ({tags}: {tags: string[]}) => (
  <div className="flex flex-row flex-wrap gap-1.5">
   
      {
        tags.map(tag => (
          <div className="pill" key={tag}>{tag}</div>
        ))
      }

  </div>
)

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { data } = await request.json();
  if (!data) return notFound();

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{data.description}</p>
      </div>

      <div className="details">
        {/* left side - Event details */}
        <div className="content">
          <Image
            src={data.image}
            alt={data.title}
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
        <h2>Overview</h2>
        <p>{data.overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon={"/icons/calendar.svg"} alt="calendar" label={data.date}/>
            <EventDetailItem icon={"/icons/clock.svg"} alt="clock" label={data.time}/>
            <EventDetailItem icon={"/icons/pin.svg"} alt="pin" label={data.location}/>
            <EventDetailItem icon={"/icons/mode.svg"} alt="mode" label={data.mode}/>
            <EventDetailItem icon={"/icons/audience.svg"} alt="audience" label={data.audience}/>
          </section>

          <EventAgenda agendaItems={JSON.parse(data.agenda[0])}/>

        <section className="flex-col-gap-2">
          <h2>About the Organizer</h2>
          <p>{data.organizer}</p>
        </section>

      <EventTags tags={JSON.parse(data.tags[0])}/>

        </div>

        {/* right side - Event details */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot
              </p>
            ): (
              <p className="text-sm">Be the first to book your spot</p>
            )}
            <BookEvent/>
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
            <h2>Similar Events</h2>
            <div className="events">
            {
              similarEvents.length > 0 && similarEvents.map((similarEvents: IEvent) => (
                <EventCard key={similarEvents.id} {...similarEvents}/>
              ))
            }
            </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
