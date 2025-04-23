'use client';

import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, ReactNode } from "react";
import Navigation from "./components/Navigation";

const CAROUSEL_IMAGES = [
  { src: "/breakfast1.jpg", alt: "Delicious breakfast spread" },
  { src: "/breakfast2.jpg", alt: "Fresh pastries and coffee" },
  { src: "/breakfast3.jpg", alt: "Healthy breakfast bowl" },
];

const REVIEWS = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "The surprise breakfast made my mom's birthday so special. Everything was perfect!",
    image: "/breakfast1.jpg",
  },
  {
    name: "John D.",
    rating: 5,
    text: "Amazing service and delicious food. Will definitely order again!",
    image: "/breakfast2.jpg",
  },
  {
    name: "Emily R.",
    rating: 5,
    text: "Such a unique and thoughtful way to brighten someone's morning.",
    image: "/breakfast3.jpg",
  },
];

interface FadeInProps {
  children: ReactNode;
  className?: string;
}

function FadeIn({ children, className = "" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`fade-in ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to ensure smooth scrolling after navigation loads
    const timer = setTimeout(() => {
      if (heroRef.current) {
        window.scrollTo({ top: heroRef.current.offsetTop, behavior: 'smooth' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white relative rounded-b-lg">
      {/* Logo in top left/center */}
      {/* <div className="absolute top-0 left-0 w-full z-30 p-6 lg:px-8">
        <Link href="/" className="block text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="text-[#ed4a5a]">Berry</span>
            <span className="text-[#88BFFF]">GoodMorning</span>
          </h1>
        </Link>
      </div> */}
      
      
      {/* Hero section with carousel */}
      <FadeIn>
      
        <div className="relative min-h-screen">
        <Navigation />
          {/* Desktop layout */}
          <div ref={heroRef} className="hidden lg:flex h-screen">
            {/* Left side - Content */}
            <div className="w-1/2 flex flex-col justify-center px-12 text-center">
              <h2 className="text-6xl font-bold mb-6 text-black">
                Surprise Someone Special
              </h2>
              <p className="text-xl mb-8 text-gray-600">
                Delight your loved ones with a magical breakfast experience delivered right to their door
              </p>
              <div>
                <Link
                  href="/browse"
                  className="bg-[#ed4a5a] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors inline-block"
                >
                  Order Now
                </Link>
              </div>
            </div>
            
            {/* Right side - Carousel */}
            <div className="w-1/2 relative">
              <div className="absolute inset-0 mt-16 m-5">
                {CAROUSEL_IMAGES.map((image, index) => (
                  <div
                    key={image.src}
                    className="absolute inset-0 opacity-0 animate-carousel"
                    style={{
                      animationDelay: `${index * 5}s`,
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="lg:hidden flex flex-col p-4">
            {/* Carousel at top */}
            <div className="relative h-[50vh]">
              {CAROUSEL_IMAGES.map((image, index) => (
                <div
                  key={image.src}
                  className="absolute inset-0 opacity-0 animate-carousel rounded-2xl overflow-hidden"
                  style={{
                    animationDelay: `${index * 5}s`,
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
            
            {/* Content below */}
            <div className="px-4 py-12 text-center">
              <h2 className="text-4xl font-bold mb-6 text-black">
                Surprise Someone Special
              </h2>
              <p className="text-xl mb-8 text-gray-600">
                Delight your loved ones with a magical breakfast experience delivered right to their door
              </p>
              <Link
                href="/browse"
                className="bg-[#ed4a5a] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors inline-block"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Quote section */}
      <FadeIn>
        <section className="relative py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/breakfast2.jpg"
                  width={500}
                  height={500}
                  alt="Breakfast spread"
                  className="rounded-2xl shadow-xl"
                />
              </div>
              <div>
                <blockquote className="text-2xl font-light text-gray-600 italic">
                  "Every morning is a chance to start someone's day with a smile. We make that chance delicious."
                </blockquote>
                <p className="mt-4 text-[#ed4a5a] font-semibold">- Our Promise</p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Reviews section */}
      <FadeIn>
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#88BFFF]">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {REVIEWS.map((review, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#ed4a5a]">{review.name}</h3>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <Footer />
    </main>
  );
}
