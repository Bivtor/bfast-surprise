import Link from 'next/link';
import Image from 'next/image';
import strawberryimage from '@/public/strawberry.png';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div> */}
          <div className="flex lg:flex-1">
        <Link href="/" className="block text-center sm:text-left">
          <h1 className="text-2xl sm:text-md font-bold flex items-center">
            <Image 
              src={strawberryimage} 
              alt="Image of a strawberry"
              width={16}
              height={16}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <span className="text-[#ed4a5a]">Berry</span>
            <span className="text-[#88BFFF]">Good</span>
            <span className="text-[#88BFaF]">Morning</span>
            
          </h1>
        </Link>
        </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/license" className="text-gray-500 hover:text-gray-900">
                  License
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Follow Us</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}