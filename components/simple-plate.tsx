"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface SimplePlateProps {
  position: [number, number, number]
  slicesCount: number
  isEating: boolean
}

export default function SimplePlate({ position, slicesCount, isEating }: SimplePlateProps) {
  const plateRef = useRef<THREE.Group>(null)
  const lastSliceRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (plateRef.current) {
      // Rotação suave do prato
      plateRef.current.rotation.y += delta * 0.2
    }

    // Animação de comer a última fatia
    if (isEating && lastSliceRef.current && slicesCount > 0) {
      // Movimento mais suave e elaborado
      lastSliceRef.current.position.y += delta * 3 // Move para cima mais rápido
      lastSliceRef.current.position.z -= delta * 1.5 // Move para trás mais lento
      lastSliceRef.current.rotation.x += delta * 2 // Rotação ao subir
      lastSliceRef.current.scale.multiplyScalar(1 - delta * 1.3) // Diminui o tamanho mais suavemente
      
      // Adiciona um pouco de movimento lateral
      lastSliceRef.current.position.x += Math.sin(state.clock.elapsedTime * 5) * delta * 0.5
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
        const isLastSlice = index === slicesCount - 1
        const angle = (index * Math.PI * 2) / 12
        const radius = 1.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <group 
            key={index} 
            position={[x, 0.1, z]} 
            rotation={[0, -angle + Math.PI, 0]}
            ref={isLastSlice ? lastSliceRef : null}
          >
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.5, 0.3]} />
              <meshStandardMaterial 
                color="#f472b6"
                transparent
                opacity={isLastSlice && isEating ? 0.5 : 1}
              />
            </mesh>
            {/* Decoração no topo da fatia */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial 
                color="#e11d48"
                transparent
                opacity={isLastSlice && isEating ? 0.5 : 1}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}