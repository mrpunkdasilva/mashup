"use client"

import * as THREE from "three"

interface PartyTableProps {
  position: [number, number, number]
}

export default function PartyTable({ position }: PartyTableProps) {
  return (
    <group position={position}>
      {/* Tampo da mesa */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[8, 8, 0.2, 32]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>

      {/* Toalha de mesa festiva */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[8.2, 8.2, 0.05, 32]} />
        <meshStandardMaterial color="#ec4899" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Decorações da mesa - confetes */}
      {Array.from({ length: 100 }).map((_, index) => {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 7
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const size = 0.05 + Math.random() * 0.1
        const color = new THREE.Color(Math.random() > 0.5 ? "#f472b6" : Math.random() > 0.5 ? "#8b5cf6" : "#38bdf8")

        return (
          <mesh key={index} position={[x, 0.18, z]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[size, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      })}

      {/* Pernas da mesa */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, index) => {
        const x = Math.cos(angle) * 6
        const z = Math.sin(angle) * 6

        return (
          <mesh key={index} position={[x, -2, z]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial color="#8b5cf6" />
          </mesh>
        )
      })}

      {/* Chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
    </group>
  )
}
