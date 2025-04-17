"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Html } from "@react-three/drei"

interface SimpleCakeProps {
  totalSlices: number
  canCollect: boolean
  onSliceSelect?: (index: number) => void
}

export default function SimpleCake({ totalSlices, canCollect, onSliceSelect }: SimpleCakeProps) {
  const cakeRef = useRef<THREE.Group>(null)
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)

  const cakeColors = {
    base: new THREE.Color("#f8d3d9"),
    frosting: new THREE.Color("#f472b6"),
    filling: new THREE.Color("#fb7185"),
    decoration: new THREE.Color("#e11d48"),
  }

  useFrame((state, delta) => {
    if (cakeRef.current && !hoveredSlice) {
      cakeRef.current.rotation.y += delta * 0.5
    }
  })

  // Criar padrão de estrela com totalSlices fatias
  const slices = Array.from({ length: totalSlices }).map((_, index) => {
    const angle = (index * Math.PI * 2) / totalSlices
    const isHovered = hoveredSlice === index
    
    // Criar padrão de estrela com duas camadas
    const isOuterLayer = index % 2 === 0
    const radius = isOuterLayer ? 1.2 : 0.8
    const height = isOuterLayer ? 0.8 : 1.2

    return (
      <group key={index} rotation={[0, angle, 0]}>
        <mesh
          position={[radius, height / 2, 0]}
          scale={isHovered ? 1.1 : 1}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredSlice(index)
          }}
          onPointerOut={() => setHoveredSlice(null)}
          onClick={(e) => {
            e.stopPropagation()
            if (onSliceSelect) onSliceSelect(index)
          }}
        >
          <boxGeometry args={[0.3, height, 0.3]} />
          <meshStandardMaterial 
            color={isOuterLayer ? cakeColors.frosting : cakeColors.filling}
            emissive={isOuterLayer ? cakeColors.frosting : cakeColors.filling}
            emissiveIntensity={isHovered ? 0.5 : 0}
            metalness={0.3}
            roughness={0.7}
          />
          {/* Decoração no topo da fatia */}
          <mesh position={[0, height / 2 + 0.1, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial 
              color={cakeColors.decoration}
              emissive={cakeColors.decoration}
              emissiveIntensity={isHovered ? 0.5 : 0}
            />
          </mesh>
        </mesh>
      </group>
    )
  })

  return (
    <group ref={cakeRef}>
      {/* Base do bolo */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial color={cakeColors.base} />
      </mesh>

      {/* Fatias em padrão de estrela */}
      {slices}

      {/* Centro decorativo */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
        <meshStandardMaterial color={cakeColors.decoration} />
      </mesh>

      {/* Vela central */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#ff3366" />
      </mesh>

      {/* Chama da vela */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={2} />
      </mesh>

      {/* Luz da vela */}
      <pointLight position={[0, 1.7, 0]} intensity={0.5} color="#ffdd00" distance={2} />

      {/* Tooltip quando hover */}
      {hoveredSlice !== null && (
        <Html position={[0, 2.2, 0]}>
          <div className="bg-black/75 text-white px-3 py-1 rounded-lg text-sm">
            Fatia {hoveredSlice + 1}
          </div>
        </Html>
      )}
    </group>
  )
}
