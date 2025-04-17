"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import * as THREE from "three"
import CakeSlice from "./cake-slice"

interface DragSliceManagerProps {
  totalSlices: number
  onSlicePlaced: () => void
  children: ReactNode
}

export default function DragSliceManager({ totalSlices, onSlicePlaced, children }: DragSliceManagerProps) {
  const { camera, scene, gl, raycaster, mouse } = useThree()
  const [draggingSlice, setDraggingSlice] = useState<boolean>(false)
  const [slicePosition, setSlicePosition] = useState<THREE.Vector3>(new THREE.Vector3(-3, 1.5, 0))
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null)
  const plateRef = useRef<THREE.Object3D | null>(null)
  const dragPlaneRef = useRef<THREE.Mesh>(null)

  // Encontrar o prato na cena
  useEffect(() => {
    // Procurar pelo prato na cena após a renderização
    scene.traverse((object) => {
      if (object.name === "plate-drop-target") {
        plateRef.current = object
      }
    })
  }, [scene])

  // Configurar o plano de arrasto invisível
  useEffect(() => {
    if (dragPlaneRef.current) {
      dragPlaneRef.current.visible = false
    }
  }, [])

  // Verificar se o mouse está sobre uma fatia
  useFrame(() => {
    if (totalSlices > 0 && !draggingSlice) {
      raycaster.setFromCamera(mouse, camera)
      const anglePerSlice = (Math.PI * 2) / 20

      // Verificar interseção com cada fatia
      for (let i = 0; i < totalSlices; i++) {
        const angle = i * anglePerSlice
        const radius = 1.2
        const position = new THREE.Vector3(-3 + Math.cos(angle) * radius * 0.6, 1.5, Math.sin(angle) * radius * 0.6)

        // Criar uma caixa de colisão temporária para verificar interseção
        const tempBox = new THREE.Box3().setFromCenterAndSize(position, new THREE.Vector3(1.2, 1, 0.3))

        // Verificar se o raio intersecta a caixa
        const ray = new THREE.Ray(raycaster.ray.origin, raycaster.ray.direction)
        if (ray.intersectsBox(tempBox)) {
          setHoveredSliceIndex(i)
          return
        }
      }

      setHoveredSliceIndex(null)
    }
  })

  // Configurar o gesto de arrastar
  const bind = useDrag(({ active, movement: [x, y], first, last }) => {
    if (first && hoveredSliceIndex !== null) {
      // Iniciar arrasto
      setDraggingSlice(true)

      // Calcular posição inicial da fatia
      const anglePerSlice = (Math.PI * 2) / 20
      const angle = hoveredSliceIndex * anglePerSlice
      const radius = 1.2
      const initialPosition = new THREE.Vector3(
        -3 + Math.cos(angle) * radius * 0.6,
        1.5,
        Math.sin(angle) * radius * 0.6,
      )
      setSlicePosition(initialPosition)
    }

    if (active) {
      // Atualizar posição durante o arrasto
      // Converter movimento do mouse para espaço 3D
      const vector = new THREE.Vector3(x / 100, -y / 100, 0)
      vector.unproject(camera)

      // Atualizar posição da fatia
      setSlicePosition(
        (prev) => new THREE.Vector3(prev.x + vector.x * 0.1, prev.y + vector.y * 0.1, prev.z + vector.z * 0.1),
      )
    }

    if (last) {
      // Verificar se a fatia foi solta sobre o prato
      if (plateRef.current) {
        const platePosition = new THREE.Vector3()
        plateRef.current.getWorldPosition(platePosition)

        // Calcular distância entre a fatia e o centro do prato
        const distance = slicePosition.distanceTo(platePosition)

        if (distance < 3) {
          // Fatia colocada no prato
          onSlicePlaced()
        }
      }

      // Finalizar arrasto
      setDraggingSlice(false)
      setHoveredSliceIndex(null)
    }
  })

  return (
    <group>
      {/* Renderizar os filhos (bolo e prato) */}
      {children}

      {/* Plano invisível para ajudar no arrasto */}
      <mesh ref={dragPlaneRef} position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Renderizar as fatias do bolo que podem ser arrastadas */}
      {Array.from({ length: totalSlices }).map((_, index) => {
        const anglePerSlice = (Math.PI * 2) / 20
        const angle = index * anglePerSlice
        const radius = 1.2
        const isHovered = hoveredSliceIndex === index

        // Calcular posição da fatia
        const position = new THREE.Vector3(-3 + Math.cos(angle) * radius * 0.6, 1.5, Math.sin(angle) * radius * 0.6)

        return <CakeSlice key={index} position={position} rotation={[0, angle, 0]} isHovered={isHovered} {...bind()} />
      })}

      {/* Fatia sendo arrastada */}
      {draggingSlice && hoveredSliceIndex !== null && (
        <CakeSlice
          position={slicePosition}
          rotation={[0, (hoveredSliceIndex * (Math.PI * 2)) / 20, 0]}
          isHovered={true}
          isDragging={true}
        />
      )}

      {/* Área de destino do prato (invisível) */}
      <mesh name="plate-drop-target" position={[3, 0, 0]} visible={false}>
        <cylinderGeometry args={[3, 3, 0.1, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}
