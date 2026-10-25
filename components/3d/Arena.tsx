'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/hooks/useGameState'
import { CHARACTERS } from '@/lib/characters'
import { Character } from './Character'

function Stage() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Octagonal stage
  const stageShape = useMemo(() => {
    const shape = new THREE.Shape()
    const sides = 8
    const radius = 5
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / sides
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      if (i === 0) shape.moveTo(x, z)
      else shape.lineTo(x, z)
    }
    shape.closePath()
    return shape
  }, [])

  const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSize: 0.05, bevelSegments: 2 }
  const stageGeo = useMemo(() => new THREE.ExtrudeGeometry(stageShape, extrudeSettings), [stageShape])

  return (
    <group>
      <mesh ref={meshRef} geometry={stageGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <meshStandardMaterial color="#0F1630" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Edge glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[4.8, 5.1, 8]} />
        <meshBasicMaterial color="#4FC3F7" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function SpotlightRig() {
  const light1Ref = useRef<THREE.SpotLight>(null)
  const light2Ref = useRef<THREE.SpotLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (light1Ref.current) {
      light1Ref.current.position.set(Math.sin(t * 0.3) * 8, 10, Math.cos(t * 0.3) * 8)
    }
    if (light2Ref.current) {
      light2Ref.current.position.set(Math.sin(t * 0.3 + Math.PI) * 8, 10, Math.cos(t * 0.3 + Math.PI) * 8)
    }
  })

  return (
    <>
      <spotLight ref={light1Ref} intensity={80} angle={0.3} penumbra={0.5} color="#4FC3F7" castShadow />
      <spotLight ref={light2Ref} intensity={80} angle={0.3} penumbra={0.5} color="#CE93D8" castShadow />
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} />
    </>
  )
}

function CharacterGallery() {
  const { participants, correctnessByPlayer, phase } = useGameStore()

  return (
    <>
      {participants.slice(0, 20).map((p, i) => {
        const char = CHARACTERS.find(c => c.id === p.characterId)
        if (!char) return null

        const total = Math.min(participants.length, 20)
        const angle = (i / total) * Math.PI * 2
        const radius = Math.min(3.5, 1.5 + total * 0.15)
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        const wasCorrect = correctnessByPlayer[p.participantId]
        const animState = phase === 'revealed'
          ? (wasCorrect === undefined ? 'idle' : wasCorrect ? 'correct' : 'incorrect')
          : phase === 'question_active' ? 'thinking'
          : 'idle'

        return (
          <Float key={p.participantId} speed={1} rotationIntensity={0} floatIntensity={0.2}>
            <group position={[x, 0, z]}>
              <Character character={char} animationState={animState} scale={0.5} />
              {/* Nickname label */}
              <mesh position={[0, 1.5, 0]}>
                <planeGeometry args={[1.2, 0.25]} />
                <meshBasicMaterial color="#0F1630" transparent opacity={0.8} />
              </mesh>
            </group>
          </Float>
        )
      })}
    </>
  )
}

export default function Arena() {
  return (
    <Canvas
      camera={{ position: [0, 6, 10], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      shadows
    >
      <fog attach="fog" args={['#0A0A1A', 15, 40]} />
      <Stars radius={30} depth={10} count={500} factor={2} fade />
      <SpotlightRig />
      <Stage />
      <CharacterGallery />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
