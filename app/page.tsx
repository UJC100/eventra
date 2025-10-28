import ExploreBtn from "@/components/ExploreBtn"

const page = () => {
  console.log("what type of component are i")
  return (
    <section className="pt-10">
      <h1 className="text-center">The Hub for Every <br/> Event You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Concerts, Tech Events, Conferences, All in One Place</p>
      <ExploreBtn/>
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {
            [1,2,3,4,5].map((event) => (
              <li key={event}>Event {event}</li>
            ))
          }
        </ul>
      </div>
    </section>
  )
}

export default page