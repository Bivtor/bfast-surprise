import Image from 'next/image';
import strawberryimage from '@/public/icons/strawberry.png';

export default function About() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
                {/* Logo at top center */}
                <div className="flex justify-center items-center mb-12">
                    <Image
                        src={strawberryimage}
                        alt="Image of a strawberry"
                        width={32}
                        height={32}
                        className="w-12 h-12 mr-3"
                    />
                    <h1 className="text-4xl font-bold">
                        <span className="text-[#ed4a5a]">Berry</span>
                        <span className="text-[#88BFFF]">Good</span>
                        <span className="text-[#88BFaF]">Morning</span>
                    </h1>
                </div>

                {/* About content */}
                <div className="text-center space-y-6">
                    <h2 className="text-3xl font-semibold mb-8">About Us</h2>

                    <p className="text-lg leading-relaxed">
                        Start your day the berry good way! We believe that breakfast is the most important meal of the day,
                        and it should be something special. That's why we deliver carefully curated breakfast boxes right
                        to your door, packed with love and a sent in a fun little box.
                    </p>

                    <p className="text-lg leading-relaxed">
                        Whether you're treating yourself to a delightful morning surprise, showing someone special how much
                        you care, or bringing your team together with a shared breakfast experience, our breakfast boxes are
                        designed to make every morning feel like a celebration.
                    </p>

                    <p className="text-lg leading-relaxed">
                        Each box is thoughtfully assembled with fresh, quality ingredients. From pastries to fresh fruits,
                        every BerryGoodMorning box is a box of joy delivered straight to your doorstep.
                    </p>

                    <p className="text-lg leading-relaxed">
                        Because every morning deserves to be berry good.
                    </p>

                    <p className="text-lg leading-relaxed">
                        Please reach out to contact@berrygoodmorning.com for more info!
                    </p>
                </div>
            </div>
        </div>
    );
}