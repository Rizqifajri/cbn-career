import { Instagram, Linkedin, Youtube } from "lucide-react"
import { Card } from "./ui/card"
import Image from "next/image"

export const SosmedSection = () => {
  return (
    <section className="container  lg:mx-24 xl:mx-auto p-5 flex flex-col gap-8">
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-left">Social Media</h1>
      
      {/* Cretivox */}
      <Card className="flex flex-col sm:flex-row bg-black text-white p-6 justify-between items-center rounded-md">
        <Image className="w-32 sm:w-48" src="/cretivox-white.png" width={400} height={400} alt="Cretivox Logo" />
        <ul className="flex gap-6 text-3xl sm:text-4xl">
          <li>
            <a href="https://instagram.com/cretivox.id" target="_blank">
              <Instagram />
            </a>
          </li>
          <li>
            <a href="https://linkedin.com" target="_blank">
              <Linkedin />
            </a>
          </li>
          <li>
            <a href="https://youtube.com" target="_blank">
              <Youtube />
            </a>
          </li>
        </ul>
      </Card>

      {/* OGS */}
      <Card className="flex flex-col sm:flex-row bg-[#86E553] text-white p-6 justify-between items-center rounded-md">
        <h2 className="text-4xl sm:text-5xl font-bold text-center sm:text-left">OGS</h2>
        <ul className="flex gap-6 text-3xl sm:text-4xl">
          <li>
            <a href="https://instagram.com/ogs.id" target="_blank">
              <Instagram />
            </a>
          </li>
          <li>
            <a href="https://linkedin.com" target="_blank">
              <Linkedin />
            </a>
          </li>
          <li>
            <a href="https://youtube.com" target="_blank">
              <Youtube />
            </a>
          </li>
        </ul>
      </Card>

      {/* Condfe */}
      <Card className="flex flex-col sm:flex-row bg-[#BC9FCB] text-white p-6 justify-between items-center rounded-md">
        <Image className="w-32 sm:w-48" src="/condfe-logo.png" width={400} height={400} alt="Cretivox Logo" />
        <ul className="flex gap-6 text-3xl sm:text-4xl">
          <li>
            <a href="https://instagram.com/condfe.id" target="_blank">
              <Instagram />
            </a>
          </li>
            <li>
            <a href="https://linkedin.com" target="_blank">
              <Linkedin />
            </a>
          </li>
          <li>
            <a href="https://youtube.com" target="_blank">
              <Youtube />
            </a>
          </li>
        </ul>
      </Card>
    </section>
  )
}
