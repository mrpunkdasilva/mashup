"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type * as THREE from "three"

interface PlateProps {
  position: [number, number, number]
  slicesCount: number
}

export default function Plate({ position, slicesCount }: PlateProps) {
  const plateRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (plateRef.current) {
      // Rotação suave do prato
      plateRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={plateRef} position={position}>
      {/* Destaque visual para o prato */}
      <pointLight position={[0, 1, 0]} intensity={0.5} color="#ffffff" distance={5} />

      {/* Base do prato */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[3, 3.2, 0.2, 32]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.3} roughness={0.2} />
      </mesh>

      {/* Superfície do prato */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Renderizar as fatias no prato - máximo de 12 visíveis */}
      {Array.from({ length: Math.min(slicesCount, 12) }).map((_, index) => {
        const angle = (index * Math.PI * 2) / 12
        const radius = 1.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <group key={index} position={[x, 0.1, z]} rotation={[0, -angle + Math.PI, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.5, 0.3]} />
              <meshStandardMaterial color="#f472b6" />
            </mesh>
          </group>
        )
      })}

      {/* Indicador de fatias extras - quando há mais de 12 fatias */}
      {slicesCount > 12 && (
        <group position={[0, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.3}
            color="#ffffff"
            font="/fonts/Inter_Bold.json"
            anchorX="center"
            anchorY="middle"
          >
            +{slicesCount - 12}
          </Text>
        </group>
      )}
    </group>
  )
}
