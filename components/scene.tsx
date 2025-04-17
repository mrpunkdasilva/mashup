"use client"

import { useRef, useState, useCallback } from "react"
import { Float, Html } from "@react-three/drei"
import SimpleCake from "./simple-cake"
import SimplePlate from "./simple-plate"
import PartyTable from "./party-table"
import StickFigure from "./stick-figure"
import * as THREE from "three"

interface SceneProps {
  totalSlices: number
  slicesOnPlate: number
  onSlicePlaced: () => void
}

export default function Scene({ totalSlices, slicesOnPlate, onSlicePlaced }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [nearCake, setNearCake] = useState(false)

  const checkProximity = useCallback((playerPosition: THREE.Vector3) => {
    if (!groupRef.current) return
    const cakePosition = new THREE.Vector3(-3, 1.5, 0)
    const distance = playerPosition.distanceTo(cakePosition)
    const isNear = distance < 2
    if (isNear !== nearCake) {
      setNearCake(isNear)
    }
  }, [nearCake])

  const handleCollectSlice = useCallback(() => {
    if (nearCake && totalSlices > 0) {
      onSlicePlaced()
    }
  }, [nearCake, totalSlices, onSlicePlaced])

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        castShadow
      />

      <PartyTable position={[0, -1, 0]} />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[-3, 1.5, 0]}>
        <SimpleCake totalSlices={totalSlices} canCollect={nearCake} />
      </Float>

      <SimplePlate position={[3, 0, 0]} slicesCount={slicesOnPlate} />

      <StickFigure onMove={checkProximity} onCollectSlice={handleCollectSlice} />

      {nearCake && totalSlices > 0 && (
        <Html
          position={[0, 4, 0]}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Pressione ESPAÇO para pegar uma fatia
        </Html>
      )}
    </group>
  )
}


