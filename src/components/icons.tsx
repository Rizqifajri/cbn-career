import Image from "next/image"
import type * as React from "react"

export const InterviewUserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <>
      <Image src={'/icon/user-int.png'} alt="" width={40} height={40} />
    </>
  )
}

export const InterviewManagerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <>
      <Image src={'/icon/mng-int.png'} alt="" width={40} height={40} />
    </>
  )
}

export const InterviewHRIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <>
      <Image src={'/icon/hr-int.png'} alt="" width={40} height={40} />
    </>
  )
}
