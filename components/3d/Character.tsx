'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Character as CharacterType } from '@/lib/characters'

interface Props {
  character: CharacterType
  animationState?: 'idle' | 'thinking' | 'correct' | 'incorrect' | 'victory'
  scale?: number
  onClick?: () => void
}

export function Character({ character, animationState = 'idle', scale = 1, onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const stateTimeRef = useRef(0)

  const bodyColor = useMemo(() => new THREE.Color(character.color), [character.color])
  const accentColor = useMemo(() => new THREE.Color(character.accentColor), [character.accentColor])
  const eyeColor = useMemo(() => new THREE.Color(character.eyeColor), [character.eyeColor])

  // Reset animation time when state changes
  useEffect(() => {
    stateTimeRef.current = 0
  }, [animationState])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    timeRef.current = t
    const group = groupRef.current
    const head = headRef.current
    if (!group || !head) return

    const st = stateTimeRef.current
    stateTimeRef.current += 0.016

    switch (animationState) {
      case 'idle':
        group.position.y = Math.sin(t * 1.5) * 0.05
        head.rotation.y = Math.sin(t * 0.8) * 0.15
        group.rotation.y = 0
        group.scale.setScalar(scale)
        break

      case 'thinking':
        group.position.y = Math.sin(t * 2) * 0.03
        head.rotation.x = -0.1 + Math.sin(t * 1.2) * 0.05
        head.rotation.z = Math.sin(t * 0.7) * 0.08
        break

      case 'correct':
        if (st < 1.5) {
          group.position.y = Math.sin(st * 8) * 0.2 * Math.exp(-st * 2)
          group.rotation.y = st * 4
          group.scale.setScalar(scale * (1 + Math.sin(st * 6) * 0.1 * Math.exp(-st * 3)))
        } else {
          group.position.y = Math.sin(t * 1.5) * 0.05
          group.rotation.y = 0
          group.scale.setScalar(scale)
        }
        break

      case 'incorrect':
        if (st < 0.5) {
          group.position.x = Math.sin(st * 30) * 0.1 * (1 - st * 2)
        } else {
          group.position.x = 0
          group.position.y = -0.05
        }
        break

      case 'victory':
        group.rotation.y = t * 2
        group.position.y = 0.3 + Math.sin(t * 3) * 0.1
        group.scale.setScalar(scale * (1.1 + Math.sin(t * 4) * 0.05))
        break
    }
  })

  return (
    <group ref={groupRef} scale={scale} onClick={onClick}>
      {/* Body (capsule) */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 4, 8]} />
        <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.7} />
      </mesh>

      {/* Accent trim */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[0.26, 0.03, 4, 8]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.28, 8, 6]} />
        <meshStandardMaterial color={bodyColor} metalness={0.1} roughness={0.6} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.1, 1.45, 0.24]}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshBasicMaterial color={eyeColor} />
      </mesh>
      <mesh position={[-0.1, 1.45, 0.24]}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshBasicMaterial color={eyeColor} />
      </mesh>

      {/* Feet */}
      <mesh position={[0.1, 0.05, 0]}>
        <sphereGeometry args={[0.1, 4, 4]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[-0.1, 0.05, 0]}>
        <sphereGeometry args={[0.1, 4, 4]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Point light for glow effect */}
      <pointLight
        position={[0, 1, 0]}
        intensity={animationState === 'correct' ? 2 : animationState === 'victory' ? 3 : 0.3}
        distance={2}
        color={character.eyeColor}
      />
    </group>
  )
}

export default Character
