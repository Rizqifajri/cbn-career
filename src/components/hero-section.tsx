"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

export const HeroSection = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ambil nilai awal dari URL (?q=)
  const initialQ = useMemo(() => searchParams.get("q") ?? "", [searchParams])
  const [q, setQ] = useState(initialQ)

  // sync input saat URL berubah (back/forward)
  useEffect(() => setQ(initialQ), [initialQ])

  // debounce update URL saat user ngetik
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (q.trim()) params.set("q", q.trim())
      else params.delete("q")
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)
    return () => clearTimeout(handler)
  }, [q, pathname, router, searchParams])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (q.trim()) params.set("q", q.trim())
    else params.delete("q")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // kontrol fade-in saat image selesai dimuat
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <section
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden",
        // fallback h-screen, modern browser pakai h-[100dvh]
        "h-screen md:h-[100dvh]"
      )}
    >
      {/* Fallback warna + gradient (langsung tampil) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-white/90 to-white/80" />

      {/* Background hero pakai Next/Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero/cbn-rame.jpg"
          alt="CBN Career hero background"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Crect width='16' height='10' fill='%23f3f4f6'/%3E%3C/svg%3E"
          className={cn(
            "object-cover transition-opacity duration-500",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />
      </div>

      {/* Konten */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
        <h1 className="font-sans font-semibold text-4xl leading-tight sm:text-5xl lg:text-7xl text-white">
          Ready for a Career <br className="hidden sm:block" /> at CBN ?
        </h1>

        <form className="relative mx-auto w-full max-w-[720px] group" onSubmit={onSubmit}>
          <div className="relative mx-auto w-[92%] sm:w-4/5 md:w-full">
            <Input
              name="q"
              type="text"
              placeholder="Search Position..."
              aria-label="Search Position"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={cn(
                "h-12 rounded-full pl-5 pr-16 text-base sm:pr-20",
                "bg-white/95 shadow-lg backdrop-blur-sm",
                "placeholder:text-gray-400 transition-all duration-300",
                "focus-visible:ring-2 focus-visible:ring-black/20 text-black",
                "group-hover:shadow-xl group-hover:bg-white",
              )}
            />

            <Button
              type="submit"
              size="icon"
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2",
                "h-10 w-10 rounded-full sm:h-12 sm:w-12",
                "bg-black text-white hover:bg-black/90",
                "transition-all duration-300 hover:scale-110",
                "hover:shadow-lg",
              )}
              aria-label="Search"
            >
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
