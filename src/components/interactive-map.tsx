"use client"
import { useEffect, useRef } from "react"

interface InteractiveMapProps {
  className?: string
}

export function InteractiveMap({ className }: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    // Pastikan tidak ada duplikat marker
    if (containerRef.current.querySelector(".custom-marker")) return

    const marker = document.createElement("div")
    marker.className = "custom-marker"
    marker.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -100%);
      width: 30px;
      height: 30px;
      background: #dc2626;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg) translate(-50%, -100%);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      z-index: 10;
      pointer-events: none;
    `

    containerRef.current.appendChild(marker)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4!2d106.8947!3d-6.1944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0a91e28!2sJl.%20Balap%20Sepeda%20No.6%2C%20RT.15%2FRW.1%2C%20Rawamangun%2C%20Kec.%20Pulo%20Gadung%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2013220!5e0!3m2!1sen!2sid!4v1635724800000!5m2!1sen!2sid"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  )
}
