"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

// Componente para criar balões de festa
function Balloon({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Corpo do balão */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.2} />
      </mesh>

      {/* Base do balão */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 0.1, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cordão do balão */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 2, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

// Componente para criar confetes flutuantes
function Confetti() {
  const confettiCount = 100
  const confettiRef = useRef<THREE.Group>(null)

  // Criar posições aleatórias para os confetes
  const confettiPositions = Array.from({ length: confettiCount }).map(() => ({
    position: [(Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20] as [number, number, number],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
    speed: 0.2 + Math.random() * 0.5,
    color: Math.random() > 0.5 ? "#f472b6" : Math.random() > 0.5 ? "#8b5cf6" : "#38bdf8",
  }))

  useFrame((state, delta) => {
    if (confettiRef.current) {
      confettiRef.current.children.forEach((confetti, index) => {
        // Movimento de queda lenta com rotação
        confetti.position.y -= confettiPositions[index].speed * delta
        confetti.rotation.x += delta * 0.5
        confetti.rotation.z += delta * 0.3

        // Reposicionar confete quando cai abaixo do chão
        if (confetti.position.y < -5) {
          confetti.position.y = 10
          confetti.position.x = (Math.random() - 0.5) * 20
          confetti.position.z = (Math.random() - 0.5) * 20
        }
      })
    }
  })

  return (
    <group ref={confettiRef}>
      {confettiPositions.map((confetti, index) => (
        <mesh key={index} position={confetti.position} rotation={confetti.rotation}>
          <boxGeometry args={[0.1, 0.1, 0.01]} />
          <meshStandardMaterial color={confetti.color} />
        </mesh>
      ))}
    </group>
  )
}

export default function PartyEffects() {
  // Cores festivas para os balões
  const balloonColors = ["#f472b6", "#8b5cf6", "#38bdf8", "#fb7185", "#34d399"]

  return (
    <group>
      {/* Balões de festa ao redor da cena */}
      {Array.from({ length: 10 }).map((_, index) => {
        const angle = (index / 10) * Math.PI * 2
        const radius = 8 + Math.random() * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = 3 + Math.random() * 5

        return <Balloon key={index} position={[x, y, z]} color={balloonColors[index % balloonColors.length]} />
      })}

      {/* Confetes caindo */}
      <Confetti />
    </group>
  )
}
