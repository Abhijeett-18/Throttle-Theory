import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <img
        src="/yess.jpeg"
        className="opacity-50 w-full h-full object-cover absolute top-0 left-0 z-0"
        alt=""
      />
      <div className="relative z-10 h-full">
        <Navbar />
        <div className="absolute bottom-16 left-6 md:left-12 right-6 md:right-auto flex flex-col space-y-4 max-w-xl">
          <h2 className="font-clash text-white font-bold text-2xl sm:text-3xl md:text-4xl text-left">
            Fuel Your Fit. Rule the Streets.
          </h2>
          <p className="font-clash text-white font-medium text-sm sm:text-base md:text-lg leading-relaxed text-left">
            Born on the track, built for the streets. Clean lines, bold details,
            and the spirit of speed — reimagined for everyday wear.
          </p>
          <div className="flex gap-4">
            <Link
              to="/categories"
              className="px-4 sm:px-6 py-2 border border-white rounded-2xl text-white font-clash font-medium hover:bg-white hover:text-black transition-all duration-300 text-sm sm:text-base"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
