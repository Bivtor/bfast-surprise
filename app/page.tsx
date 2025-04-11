import Image from "next/image";
import Link from "next/link";
import Navigation from "@/app/components/Navigation";

const CAROUSEL_IMAGES = [
  { src: "/breakfast1.jpg", alt: "Delicious breakfast spread" },
  { src: "/breakfast2.jpg", alt: "Fresh pastries and coffee" },
  { src: "/breakfast3.jpg", alt: "Healthy breakfast bowl" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="relative h-[70vh] bg-gray-900">
        {/* Hero banner */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Breakfast Surprise
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Delight someone special with a magical breakfast experience delivered right to their door
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              href="/browse"
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Order Now
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Image carousel */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
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
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
