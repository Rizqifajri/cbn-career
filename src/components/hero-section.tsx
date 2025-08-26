"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

export const HeroSection = () => {
  return (
    <section
      className="relative flex h-[500px] sm:h-[600px] lg:h-[650px] w-full items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/hero/cretivox-intern-2.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-white/50" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center text-white">
        <h1 className="font-serif font-semibold text-4xl leading-tight sm:text-5xl lg:text-6xl text-black">
          Ready for a Career <br className="hidden sm:block" /> at CBN ?
        </h1>

        <form className="relative mx-auto w-full max-w-[720px] group">
          <div className="relative mx-auto w-[92%] sm:w-4/5 md:w-full">
            <Input
              name="q"
              type="text"
              placeholder="Search Position..."
              aria-label="Search Position"
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
