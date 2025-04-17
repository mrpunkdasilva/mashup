"use client"

import { Text as DreiText } from "@react-three/drei"
import type { ReactNode } from "react"

interface TextProps {
  children: ReactNode
  position: [number, number, number]
  fontSize?: number
  color?: string
  font?: string
  anchorX?: "left" | "center" | "right"
  anchorY?: "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom"
}

export default function Text({
  children,
  position,
  fontSize = 0.3,
  color = "#000000",
  font = "/fonts/Inter_Regular.json",
  anchorX = "center",
  anchorY = "middle",
}: TextProps) {
  return (
    <DreiText position={position} fontSize={fontSize} color={color} font={font} anchorX={anchorX} anchorY={anchorY}>
      {children}
    </DreiText>
  )
}
