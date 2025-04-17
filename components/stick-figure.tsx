"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface StickFigureProps {
  onCollectSlice: () => void
}

export default function StickFigure({ onCollectSlice }: StickFigureProps) {
  const figureRef = useRef<THREE.Group>(null)
  const [position, setPosition] = useState({ x: 0, z: 0 })
  const [rotation, setRotation] = useState(0)
  const moveSpeed = 0.1
  const rotateSpeed = 0.1
  
  // Controles de movimento
  useFrame((state, delta) => {
    if (!figureRef.current) return

    const keys = state.controls.keys || {}
    let moved = false

    // Movimento para frente/trás
    if (keys.ArrowUp || keys.KeyW) {
      setPosition(prev => ({
        x: prev.x + Math.sin(rotation) * moveSpeed,
        z: prev.z + Math.cos(rotation) * moveSpeed
      }))
      moved = true
    }
    if (keys.ArrowDown || keys.KeyS) {
      setPosition(prev => ({
        x: prev.x - Math.sin(rotation) * moveSpeed,
        z: prev.z - Math.cos(rotation) * moveSpeed
      }))
      moved = true
    }

    // Rotação
    if (keys.ArrowLeft || keys.KeyA) {
      setRotation(prev => prev + rotateSpeed)
    }
    if (keys.ArrowRight || keys.KeyD) {
      setRotation(prev => prev - rotateSpeed)
    }

    // Atualizar posição e rotação
    figureRef.current.position.x = position.x
    figureRef.current.position.z = position.z
    figureRef.current.rotation.y = rotation
  })

  return (
    <group ref={figureRef} position={[0, 0, 0]}>
      {/* Cabeça */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffcd94" />
      </mesh>

      {/* Corpo */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Braços */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Pernas */}
      <group position={[0, 0.8, 0]}>
        {/* Perna esquerda */}
        <mesh position={[-0.1, 0, 0]} rotation={[0.2, 0, 0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Perna direita */}
        <mesh position={[0.1, 0, 0]} rotation={[-0.2, 0, -0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  )
}