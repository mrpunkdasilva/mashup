"use client"

import * as THREE from "three"

export default function Cake() {
  // Cores do bolo
  const cakeColors = {
    base: new THREE.Color("#f8d3d9"), // Rosa claro para a base
    frosting: new THREE.Color("#f472b6"), // Rosa médio para a cobertura
    filling: new THREE.Color("#fb7185"), // Rosa avermelhado para o recheio
    decoration: new THREE.Color("#e11d48"), // Vermelho para decorações
  }

  return (
    <group>
      {/* Base do bolo */}
      <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2, 2.2, 0.5, 32]} />
        <meshStandardMaterial color={cakeColors.base} />
      </mesh>

      {/* Cobertura central do bolo */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color={cakeColors.frosting} />
      </mesh>

      {/* Velas de aniversário */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#ff3366" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 1.5, 0]} intensity={0.5} color="#ffdd00" distance={1} />
    </group>
  )
}
