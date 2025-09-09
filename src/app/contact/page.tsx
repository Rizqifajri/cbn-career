"use client"
import { ClientEffects } from "@/components/client-effects"
import { Footer } from "@/components/footer"
import { NavigationMenu } from "@/components/navigation-menu"
import { InteractiveMap } from "@/components/interactive-map"

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <NavigationMenu />

      {/* Main Content */}
      <main className="flex-grow">
        <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-32">
          <ClientEffects />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Main Heading */}
            <div className="flex flex-col justify-start my-auto">
              <h1 className="text-6xl md:text-8xl font-bold font-serif leading-tight text-black">Contact Us</h1>
              <p className="text-gray-700 text-lg mt-4 font-medium"> Get in touch with us for careers or visit our office at the address below.</p>
            </div>

            {/* Right Column - Contact Info and Map */}
            <div className="flex flex-col gap-8">
              {/* Contact Information Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Careers */}
                <div>
                  <h3 className="uppercase text-lg font-bold text-black mb-2">Careers</h3>
                  <p className="text-gray-700 font-medium">hr@cretivox.com</p>
                </div>

                {/* Address */}
                <div>
                  <h3 className="uppercase text-lg font-bold text-black mb-2">Address</h3>
                  <p className="text-gray-700 font-medium leading-relaxed text-sm">
                    Jl. Balap Sepeda No.6, RT.15/RW.1
                    <br />
                    Rawamangun, Kec. Pulo Gadung
                    <br />
                    Kota Jakarta Timur
                    <br />
                    Daerah Khusus Ibukota Jakarta 13220
                  </p>
                </div>
              </div>

              {/* Map Section */}
              <div className="w-full h-80 md:h-96">
                <InteractiveMap className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
