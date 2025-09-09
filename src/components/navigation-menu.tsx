"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export const NavigationMenu = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBar, setShowBar] = useState(true)
  const lastYRef = useRef(0)
  const tickingRef = useRef(false)
  const THRESHOLD = 6
  const pathname = usePathname()

  const isContactPage = pathname === "/contact"

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const scrolled = y > 10
          setIsScrolled(scrolled)

          if (!scrolled) {
            setShowBar(true)
          } else {
            const lastY = lastYRef.current
            if (y > lastY + THRESHOLD) {
              setShowBar(false)
            } else if (y < lastY - THRESHOLD) {
              setShowBar(true)
            }
          }

          lastYRef.current = y
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    lastYRef.current = window.scrollY || 0
    const initScrolled = lastYRef.current > 10
    setIsScrolled(initScrolled)
    setShowBar(true)

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // 👇 ganti handleScrollToWork
const handleScrollToWork = (e: React.MouseEvent) => {
  e.preventDefault()  
  if (pathname !== "/") {
    window.location.href = "/#work"
  } else {
    const el = document.getElementById("work")
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70 // offset navbar
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }
}


  return (
    <nav
      className={[
        "fixed left-0 right-0 top-0 z-50",
        "transition-all duration-300 ease-out will-change-transform",
        showBar ? "translate-y-0" : "-translate-y-full",
        (isScrolled || isContactPage)
          ? "bg-white/95 shadow-sm backdrop-blur"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="container mx-4 sm:mx-8 lg:mx-24 xl:mx-auto flex h-[70px] w-full items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={(isScrolled || isContactPage) ? "/cretivox.png" : "/cretivox-white.png"}
              alt="CBN Logo"
              width={100}
              height={100}
              className="-ml-5 md:ml-0 h-auto w-auto transition-opacity duration-300"
              priority
            />
          </Link>
        </div>

        {/* Menu */}
        <ul
          className={[
            "flex gap-6 sm:gap-8 md:gap-10 text-base sm:text-lg md:text-xl transition-colors duration-300 mr-4 sm:mr-6 md:mr-10",
            (isScrolled || isContactPage) ? "text-black" : "text-white",
          ].join(" ")}
        >
          <li
            onClick={handleScrollToWork}
            className="font-serif relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
          >
            Work
          </li>
          <li className="font-serif relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full cursor-pointer">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
