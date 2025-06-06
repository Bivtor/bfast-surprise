'use client';
import Link from 'next/link';
import Image from 'next/image';
import strawberryimage from '@/public/icons/strawberry.png';

export default function Navigation() {
  return (
    <header className="inset-x-0 top-0 z-50 dark:bg-black">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
        <Link href="/" className="block text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <Image 
              src={strawberryimage} 
              alt="Image of a strawberry"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <span className="text-[#ed4a5a]">Berry</span>
            <span className="text-[#88BFFF]">Good</span>
            <span className="text-[#88BFaF]">Morning</span>
            
          </h1>
        </Link>
        </div>
        <div className="flex lg:hidden">
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        </div>
      </nav>
    </header>
  );
}