'use client';

import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import { useEffect, useRef, ReactNode } from "react";
import Navigation from "./components/Navigation";

const CAROUSEL_IMAGES = [
  { src: "/images/breakfast1.jpg", alt: "Delicious breakfast spread" },
  { src: "/images/breakfast2.jpg", alt: "Fresh pastries and coffee" },
  { src: "/images/breakfast3.jpg", alt: "Healthy breakfast bowl" },
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
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (heroRef.current) {
        window.scrollTo({ top: heroRef.current.offsetTop, behavior: 'smooth' });
      }
    });
  }, []);

  return (
    <main className="min-h-screen dark:bg-black dark:text-white bg-white relative rounded-b-lg ">
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
              <h2 className="text-6xl font-bold mb-6 text-black dark:text-[#88BFFF]">
                Surprise Someone Special
              </h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-white">
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
              <p className="text-xl mb-8 text-gray-600 dark:text-white">
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
        <section className="relative py-24 bg-white  dark:bg-black ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-96">
                <Image
                  src="/images/breakfast2.jpg"
                  fill
                  alt="Breakfast spread"
                  className="rounded-2xl shadow-xl object-cover"
                  priority
                />
              </div>
              <div>
                <blockquote className="text-2xl font-light text-gray-600 italic dark:text-white">
                  "Every morning is a chance to start someone's day with a smile. We make that chance delicious."
                </blockquote>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <Footer />
    </main>
  );
}
