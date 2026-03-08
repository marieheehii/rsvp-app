import { Button } from "@/components/ui/button";
import FadeLine from "./components/FadeLine";
import DelayedFade from "./components/DelayedFade";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <div className="mt-[-30vh]"><img
        src="/poohfloat.png"
        className="absolute top-0 left-1/2 w-120 z-1 -translate-x-1/2 animate-float-leaf drop-shadow-md"
        alt="floating leaf"
      /></div>
      
      <section className="fixed top-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-auto h-20 z-10">
        <FadeLine>
          <h1 className="text-6xl md:text-xl drop-shadow-md">
            Chapter 2
          </h1>
        </FadeLine>
      </section>

      <div className="px-[1vh] mt-60 z-50">
        <section className="min-h-[50vh] w-full grid grid-cols-12 items-center">
          <div className="col-start-1 col-end-6">
            <DelayedFade delay={1000}>
              <h2>Another Little Honey...</h2>
            </DelayedFade>
          </div>
        </section>

        <section className="min-h-[40vh] w-full grid grid-cols-12 items-center">
          <div className="col-start-8 col-end-13 text-right">
            <DelayedFade delay={3000}>
              <h2>...Is On The Way</h2>
            </DelayedFade>
          </div>
        </section>

        <section className="min-h-[30vh] flex items-center justify-center z-50">
          <FadeLine>
            <h2>05 • 19 • 26</h2>
            <Link className="ui-button p-1 rounded-md border font-cursive" href="/rsvp-form">
              Baby Shower RSVP Here
            </Link>
          </FadeLine>
        </section>
      </div>
      <footer className="relative h-[60vh] w-full overflow-hidden z-0">
        <img
          src="/tree.png"
          className="absolute -bottom-15 right-0 w-150 -scale-x-100"
        />
        <img
          src="/tree.png"
          className="absolute -bottom-15 left-0 w-150"
        />
      </footer>
    </main>
    
  )
}