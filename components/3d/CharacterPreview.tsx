'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Character as CharacterType } from '@/lib/characters'
import { Character } from './Character'

interface Props {
  character: CharacterType
  animationState?: 'idle' | 'thinking' | 'correct' | 'incorrect' | 'victory'
}

export default function CharacterPreview({ character, animationState = 'idle' }: Props) {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-text-muted text-xs">Loading...</div>}>
        <Canvas camera={{ position: [0, 1.5, 3.5], fov: 40 }} style={{ width: '100%', height: '100%' }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 4, 2]} intensity={20} color={character.color} />
          <pointLight position={[-2, 2, 2]} intensity={10} color={character.accentColor} />
          <Character character={character} animationState={animationState} scale={1} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={false}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
