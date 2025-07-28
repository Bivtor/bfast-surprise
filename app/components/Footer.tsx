import Link from 'next/link';
import Image from 'next/image';
import strawberryimage from '@/public/icons/strawberry.png';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-black">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Image
              src={strawberryimage}
              alt="Image of a strawberry"
              width={16}
              height={16}
              className="w-6 h-6 mr-2"
            />
            <span className="text-[#ed4a5a]">Berry</span>
            <span className="text-[#88BFFF]">Good</span>
            <span className="text-[#88BFaF]">Morning</span>
          </Link>
          <Link href="/about" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            About
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}