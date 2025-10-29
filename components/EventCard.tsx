import Image from "next/image";
import Link from "next/link";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}



const EventCard = ({title, image, slug, location, date, time}: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
    <Image src={image} alt={title} height={300} width={410} className="poster"/>

    <div className="flex flex-row gap-2">
        <Image src={"/icons/pin.svg"} alt="location" width={14} height={14}/>
        <p>{location}</p>
    </div>
    <p className="title">{title}</p>
    </Link>
  )
}

export default EventCard