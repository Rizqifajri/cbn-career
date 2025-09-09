import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-black mt-auto w-full py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="flex flex-col lg:col-span-2 space-y-8">
            <div className="max-w-2xl">
              <p className="text-white text-lg font-regular leading-relaxed">
                Cretivox is a leading digital media company and creative agency established in 2019, dedicated to
                fostering a creative community for young people and embodying the Voice of People.
              </p>
            </div>

            <div className="flex flex-col pt-24">
              <Image
                src="/cretivox-white.png"
                alt="Cretivox Logo"
                width={200}
                height={100}
                className="h-auto -ml-4 "
              />
              <p className="text-gray-400 text-sm">
                © 2025 CRETIVOX BROADCASTING NETWORK | PRIVACY POLICY
              </p>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-semibold text-xl mb-4">CONTACT</h3>
              <div className="space-y-2 text-gray-300">
                <p>hr@cretivox.com</p>
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-xl mb-4">SOCIAL</h3>
              <div className="space-y-2 text-gray-300">
                <Link href="https://www.instagram.com/cretivox/" className="block hover:text-white transition-colors">
                  Instagram
                </Link>
                <Link href="https://www.linkedin.com/company/cretivox/" className="block hover:text-white transition-colors">
                  LinkedIn
                </Link>
                <Link href="https://www.youtube.com/@Cretivox" className="block hover:text-white transition-colors">
                  YouTube
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
