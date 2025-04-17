"use client"

import { useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import CakeSlice from "./cake-slice"
import { Html } from "@react-three/drei"

interface SliceManagerProps {
  totalSlices: number
  onSlicePlaced: () => void
}

export default function SliceManager({ totalSlices, onSlicePlaced }: SliceManagerProps) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)
  const [movingSlice, setMovingSlice] = useState<{ index: number; progress: number } | null>(null)

  // Cores do bolo
  const cakeColors = {
    frosting: new THREE.Color("#f472b6"), // Rosa médio para a cobertura
  }

  // Animação da fatia se movendo para o prato
  useFrame((state, delta) => {
    if (movingSlice) {
      // Atualizar progresso da animação
      const newProgress = movingSlice.progress + delta * 2 // Velocidade da animação

      if (newProgress >= 1) {
        // Animação concluída
        setMovingSlice(null)
        onSlicePlaced()
      } else {
        // Continuar animação
        setMovingSlice({ ...movingSlice, progress: newProgress })
      }
    }
  })

  // Manipular clique na fatia
  const handleSliceClick = (index: number) => {
    if (movingSlice) return // Não permitir cliques durante a animação

    // Iniciar animação da fatia se movendo para o prato
    setMovingSlice({ index, progress: 0 })
    setHoveredSlice(null)
  }

  if (totalSlices === 0) {
    return null
  }

  return (
    <group>
      {/* Renderizar as fatias do bolo */}
      {Array.from({ length: totalSlices }).map((_, index) => {
        const anglePerSlice = (Math.PI * 2) / 20
        const angle = index * anglePerSlice
        const radius = 1.2
        const isHovered = hoveredSlice === index

        // Calcular posição da fatia no bolo
        const x = -3 + Math.cos(angle) * radius * 0.6
        const y = 1.5
        const z = Math.sin(angle) * radius * 0.6

        return (
          <CakeSlice
            key={index}
            position={[x, y, z]}
            rotation={[0, angle, 0]}
            isHovered={isHovered}
            onPointerOver={() => setHoveredSlice(index)}
            onPointerOut={() => setHoveredSlice(null)}
            onClick={() => handleSliceClick(index)}
          />
        )
      })}

      {/* Fatia em movimento para o prato */}
      {movingSlice && (
        <MovingSlice startIndex={movingSlice.index} progress={movingSlice.progress} color={cakeColors.frosting} />
      )}

      {/* Dica visual */}
      {hoveredSlice !== null && (
        <Html
          position={[-3, 3, 0]}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          Clique para colocar no prato
        </Html>
      )}
    </group>
  )
}

// Componente para a fatia em movimento
function MovingSlice({ startIndex, progress, color }: { startIndex: number; progress: number; color: THREE.Color }) {
  // Calcular posição inicial (no bolo)
  const anglePerSlice = (Math.PI * 2) / 20
  const angle = startIndex * anglePerSlice
  const radius = 1.2
  const startX = -3 + Math.cos(angle) * radius * 0.6
  const startY = 1.5
  const startZ = Math.sin(angle) * radius * 0.6

  // Posição final (no prato)
  const endX = 3
  const endY = 0.5
  const endZ = 0

  // Interpolação entre posição inicial e final
  const x = THREE.MathUtils.lerp(startX, endX, progress)
  const y = THREE.MathUtils.lerp(startY, endY, progress)
  const z = THREE.MathUtils.lerp(startZ, endZ, progress)

  // Rotação da fatia durante o movimento
  const startRotation = [0, angle, 0]
  const endRotation = [0, Math.PI * 4 + angle, 0] // Gira algumas vezes durante o movimento

  const rotationX = THREE.MathUtils.lerp(startRotation[0], endRotation[0], progress)
  const rotationY = THREE.MathUtils.lerp(startRotation[1], endRotation[1], progress)
  const rotationZ = THREE.MathUtils.lerp(startRotation[2], endRotation[2], progress)

  // Trajetória em arco (parábola)
  const arcHeight = 3
  const arcY = startY + Math.sin(progress * Math.PI) * arcHeight

  return (
    <group position={[x, arcY, z]} rotation={[rotationX, rotationY, rotationZ]}>
      {/* Fatia de bolo */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1, 0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {/* Decoração no topo da fatia */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#e11d48" />
      </mesh>

      {/* Rastro de partículas */}
      {Array.from({ length: 10 }).map((_, i) => {
        const particleProgress = progress - i * 0.03
        if (particleProgress <= 0 || particleProgress >= 1) return null

        const particleX = THREE.MathUtils.lerp(startX, endX, particleProgress)
        const particleY = startY + Math.sin(particleProgress * Math.PI) * arcHeight
        const particleZ = THREE.MathUtils.lerp(startZ, endZ, particleProgress)

        return (
          <mesh key={i} position={[particleX, particleY, particleZ]} scale={0.1 * (1 - i * 0.08)}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#f472b6" transparent opacity={0.7 - i * 0.05} />
          </mesh>
        )
      })}
    </group>
  )
}
