"use client"

import Image from "next/image"
import * as React from "react"

type Props = {
  branch: "Cretivox" | "OGS" | "Condfe" | (string & {})
  size?: number
  className?: string
}

const LOGOS: Record<string, string> = {
  Cretivox: "/logo/CretivoxLogo.png",
  OGS: "/logo/OGSLogo.png",
  Condfe: "/logo/CondfeLogo.png",
}

const DEFAULT_LOGO = "/logo/default.png"

export function LogoByBranch({ branch, size = 56, className }: Props) {
  const src = LOGOS[branch] ?? DEFAULT_LOGO
  return (
    <Image
      src={src}
      alt={`${branch} Logo`}
      width={size}
      height={size}
      className={`object-contain ${className ?? ""}`}
      priority={false}
    />
  )
}
