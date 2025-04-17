"use client"

import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import SimpleCake from '@/components/simple-cake'
import SimplePlate from '@/components/simple-plate'
import PartyEffects from '@/components/party-effects'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import { ChatSidebar } from '@/components/chat-sidebar'
import AudioController from '@/components/audio-controller'

export default function Home() {
  const [totalSlices] = useState(40)
  const [slicesOnPlate, setSlicesOnPlate] = useState(0)
  const [eatingSlice, setEatingSlice] = useState(false)

  const handleSliceCollect = () => {
    if (slicesOnPlate < 12) {
      setSlicesOnPlate(prev => prev + 1)
    } else {
      alert('O prato está cheio! Máximo de 12 fatias.')
    }
  }

  const handleEatSlice = () => {
    if (slicesOnPlate > 0) {
      setEatingSlice(true)
      setTimeout(() => {
        setSlicesOnPlate(prev => prev - 1)
        setEatingSlice(false)
      }, 500)
    }
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <main className="relative w-screen h-screen overflow-hidden">
        {/* Fundo festivo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-gradient-xy" />

        {/* Decorações de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
          <div className="absolute inset-0 bg-[url('/confetti-pattern.png')] opacity-10 animate-float" />
        </div>

        <div className="relative z-10 h-full w-full p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white text-shadow-lg">
              🎉 Bolo Estrela 3D 🎉
            </h1>
            <AudioController className="mr-4" />
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Canvas Container */}
            <div className="lg:col-span-2 h-full flex flex-col">
              <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur-sm bg-black/10">
                <Canvas camera={{ position: [8, 6, 8], fov: 50 }} shadows>
                  <Suspense fallback={null}>
                    <color attach="background" args={['#150b1d']} />

                    <ambientLight intensity={0.7} />
                    <spotLight
                      position={[10, 10, 10]}
                      angle={0.3}
                      penumbra={1}
                      intensity={2}
                      castShadow
                    />

                    <group position={[-3, 0, 0]}>
                      <SimpleCake
                        totalSlices={totalSlices - slicesOnPlate}
                        canCollect={true}
                        onSliceSelect={handleSliceCollect}
                      />
                    </group>

                    <group position={[3, 0, 0]}>
                      <SimplePlate
                        position={[0, 0, 0]}
                        slicesCount={slicesOnPlate}
                        isEating={eatingSlice}
                      />
                    </group>

                    <PartyEffects />

                    <OrbitControls
                      enableZoom={true}
                      enablePan={false}
                      maxPolarAngle={Math.PI / 2}
                      minPolarAngle={0}
                    />
                    <Environment preset="night" background blur={0.8} />

                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                      <planeGeometry args={[50, 50]} />
                      <meshStandardMaterial color="#1a0f2a" metalness={0.2} roughness={0.8} />
                    </mesh>
                  </Suspense>
                </Canvas>
              </div>
              
              <button
                onClick={handleEatSlice}
                disabled={slicesOnPlate === 0}
                className="mt-4 px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800/50 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-lg transition-colors"
              >
                Comer Fatia {slicesOnPlate > 0 ? `(${slicesOnPlate})` : ''}
              </button>
            </div>

            {/* Chat Container */}
            <div className="lg:col-span-1 h-full rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur-sm bg-black/10">
              <ChatSidebar />
            </div>
          </div>

          <div className="text-white/80 mt-4 text-sm text-center backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg">
            Clique nas fatias do bolo para colocá-las no prato ✨
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}