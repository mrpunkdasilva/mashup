"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface CakeSliceProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  isHovered?: boolean
  onPointerOver?: () => void
  onPointerOut?: () => void
  onClick?: () => void
}

export default function CakeSlice({
  position,
  rotation = [0, 0, 0],
  isHovered = false,
  onPointerOver,
  onPointerOut,
  onClick,
}: CakeSliceProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Cores do bolo
  const cakeColors = {
    frosting: new THREE.Color("#f472b6"), // Rosa médio para a cobertura
    decoration: new THREE.Color("#e11d48"), // Vermelho para decorações
  }

  useFrame(() => {
    if (meshRef.current) {
      // Efeito de hover
      if (isHovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
        meshRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.1 + 0.1
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        meshRef.current.position.y = 0
      }
    }
  })

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* Fatia de bolo */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1, 0.3]} />
        <meshStandardMaterial
          color={cakeColors.frosting}
          emissive={isHovered ? "#f472b6" : "#000000"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
      </mesh>

      {/* Decoração no topo da fatia */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={cakeColors.decoration}
          emissive={isHovered ? "#e11d48" : "#000000"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
      </mesh>
    </group>
  )
}
