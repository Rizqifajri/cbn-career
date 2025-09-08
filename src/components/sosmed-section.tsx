import { Instagram, Linkedin, Youtube } from "lucide-react"
import { Card } from "./ui/card"
import Image from "next/image"

export const SosmedSection = () => {
  return (
    <section className="container  lg:mx-24 xl:mx-auto p-5 flex flex-col gap-8">
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-left">Social Media</h1>
      
      {/* Cretivox */}
      <Card className="flex flex-col sm:flex-row bg-black text-white p-6 justify-between items-center rounded-md">
        <Image className="w-32" src="/cretivox-white.png" width={500} height={500} alt="Cretivox Logo" />
        <ul className="flex gap-6 text-3xl sm:text-4xl">
          <li>
            <a href="https://www.instagram.com/cretivox/" target="_blank">
              <Instagram />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/company/cretivox/" target="_blank">
              <Linkedin />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@Cretivox" target="_blank">
              <Youtube />
            </a>
          </li>
        </ul>
      </Card>

      {/* OGS */}
      <Card className="flex flex-col sm:flex-row bg-[#86E553] text-white p-6 justify-between items-center rounded-md">
        <Image className="w-32" src="/logo/ogs-white.png" width={400} height={400} alt="OGS Logo" />
        <ul className="flex gap-6 text-3xl sm:text-4xl">
          <li> 
            <a href="https://www.instagram.com/ogsmedia_/" target="_blank">
              <Instagram />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/company/ogs-overon-gaming-syndicate/" target="_blank">
              <Linkedin />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@ogsmedia_" target="_blank">
              <Youtube />
            </a>
          </li>
        </ul>
      </Card>

      {/* Condfe */}
      <Card className="flex flex-col sm:flex-row bg-[#BC9FCB] text-white p-6 justify-between items-center rounded-md">
        <Image className="w-42 p-5" src="/condfe-logo.png" width={400} height={400} alt="Cretivox Logo" />
        <ul className="flex gap-6 text-3xl sm:text-4xl">
          <li>
            <a href="https://www.instagram.com/condfe/" target="_blank">
              <Instagram />
            </a>
          </li>
            <li>
            <a href="https://www.linkedin.com/company/condfe/" target="_blank">
              <Linkedin />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@condfe" target="_blank">
              <Youtube />
            </a>
          </li>
        </ul>
      </Card>
    </section>
  )
}
