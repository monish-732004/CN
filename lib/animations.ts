import * as THREE from 'three'
import { ClickActionType } from './characters'

export type AnimationFn = (
  scene: THREE.Scene,
  characterGroup: THREE.Group,
  config: { duration: number; particleColor: string },
  onComplete: () => void
) => void

function createParticles(scene: THREE.Scene, color: string, count: number, origin: THREE.Vector3): THREE.Points {
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const velocities: number[] = []
  for (let i = 0; i < count; i++) {
    positions[i * 3] = origin.x
    positions[i * 3 + 1] = origin.y
    positions[i * 3 + 2] = origin.z
    velocities.push(
      (Math.random() - 0.5) * 0.15,
      Math.random() * 0.1 + 0.05,
      (Math.random() - 0.5) * 0.15,
    )
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({ color: new THREE.Color(color), size: 0.08, transparent: true })
  const particles = new THREE.Points(geo, mat)
  ;(particles as any).velocities = velocities
  scene.add(particles)
  return particles
}

function animateParticles(particles: THREE.Points, duration: number, onComplete: () => void) {
  const mat = particles.material as THREE.PointsMaterial
  const pos = (particles.geometry.attributes.position as THREE.BufferAttribute)
  const vels = (particles as any).velocities as number[]
  const startTime = performance.now()

  const tick = () => {
    const elapsed = (performance.now() - startTime) / 1000
    if (elapsed >= duration) {
      particles.parent?.remove(particles)
      particles.geometry.dispose()
      mat.dispose()
      onComplete()
      return
    }
    const progress = elapsed / duration
    mat.opacity = 1 - progress

    for (let i = 0; i < pos.count; i++) {
      pos.array[i * 3] += vels[i * 3]
      pos.array[i * 3 + 1] += vels[i * 3 + 1] - 0.003
      pos.array[i * 3 + 2] += vels[i * 3 + 2]
    }
    pos.needsUpdate = true
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// ── Generic scale-pulse + particle burst (used by many animations) ──
function scalePulseWithParticles(
  scene: THREE.Scene,
  group: THREE.Group,
  config: { duration: number; particleColor: string },
  scaleTarget: number,
  onComplete: () => void
) {
  const particles = createParticles(scene, config.particleColor, 30, new THREE.Vector3(group.position.x, 1, group.position.z))
  const originalScale = group.scale.clone()
  const startTime = performance.now()
  const durationMs = config.duration

  const animate = () => {
    const elapsed = performance.now() - startTime
    if (elapsed >= durationMs) {
      group.scale.copy(originalScale)
      return
    }
    const t = elapsed / durationMs
    const scale = 1 + Math.sin(t * Math.PI) * (scaleTarget - 1)
    group.scale.set(originalScale.x * scale, originalScale.y * scale, originalScale.z * scale)
    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
  animateParticles(particles, config.duration / 1000, onComplete)
}

export const CLICK_ANIMATIONS: Partial<Record<ClickActionType, AnimationFn>> = {
  power_up_aura: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.3, done),
  blood_demon_art: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.4, done),
  titan_shake: (scene, group, config, done) => {
    const particles = createParticles(scene, config.particleColor, 20, new THREE.Vector3(0, 1, 0))
    const startTime = performance.now()
    const original = group.position.clone()
    const tick = () => {
      const elapsed = performance.now() - startTime
      if (elapsed >= config.duration) { group.position.copy(original); return }
      group.position.x = original.x + (Math.random() - 0.5) * 0.1
      group.position.z = original.z + (Math.random() - 0.5) * 0.1
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    animateParticles(particles, config.duration / 1000, done)
  },
  lightning_burst: (scene, group, config, done) => {
    const color = new THREE.Color(config.particleColor)
    const lines: THREE.Line[] = []
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3((Math.random() - 0.5) * 2, 1 + Math.random() * 1.5, (Math.random() - 0.5) * 2),
      ])
      const mat = new THREE.LineBasicMaterial({ color, transparent: true })
      const line = new THREE.Line(geo, mat)
      group.add(line)
      lines.push(line)
    }
    setTimeout(() => {
      lines.forEach(l => { group.remove(l); l.geometry.dispose() })
      done()
    }, config.duration)
  },
  water_spin: (scene, group, config, done) => {
    const color = new THREE.Color(config.particleColor)
    const startTime = performance.now()
    const rings: THREE.Mesh[] = []
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.TorusGeometry(0.4 + i * 0.2, 0.03, 4, 8)
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 })
      const ring = new THREE.Mesh(geo, mat)
      ring.position.y = 0.8 + i * 0.3
      group.add(ring)
      rings.push(ring)
    }
    const tick = () => {
      const elapsed = performance.now() - startTime
      if (elapsed >= config.duration) { rings.forEach(r => group.remove(r)); done(); return }
      const t = elapsed / config.duration
      rings.forEach((r, i) => {
        r.rotation.y = t * Math.PI * 4 + i * Math.PI / 3
        ;(r.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.6
      })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },
  sword_slash: (scene, group, config, done) => {
    const geo = new THREE.BoxGeometry(2, 0.05, 0.02)
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.particleColor), transparent: true })
    const slash = new THREE.Mesh(geo, mat)
    slash.position.set(0, 1.2, 0)
    group.add(slash)
    const startTime = performance.now()
    const tick = () => {
      const elapsed = performance.now() - startTime
      if (elapsed >= config.duration) { group.remove(slash); mat.dispose(); done(); return }
      const t = elapsed / config.duration
      slash.rotation.z = -Math.PI / 4 + t * Math.PI / 2
      mat.opacity = 1 - t
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },
  speed_blur: (scene, group, config, done) => {
    const original = group.position.clone()
    const ghosts: THREE.Group[] = []
    for (let i = 0; i < 3; i++) {
      const ghost = group.clone()
      ghost.position.x += (i - 1) * 0.5
      ghost.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = (child.material as THREE.MeshStandardMaterial).clone()
          ;(child.material as THREE.MeshStandardMaterial).transparent = true
          ;(child.material as THREE.MeshStandardMaterial).opacity = 0.3
        }
      })
      scene.add(ghost)
      ghosts.push(ghost)
    }
    setTimeout(() => {
      ghosts.forEach(g => scene.remove(g))
      done()
    }, config.duration)
  },
  // Default: particles
  rasengan_charge: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.2, done),
  sharingan_flash: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.15, done),
  alchemy_clap: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.1, done),
  saiyan_transform: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.5, done),
  berserker_roar: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.3, done),
  giant_fist: (scene, group, config, done) => scalePulseWithParticles(scene, group, config, 1.25, done),
  rubber_stretch: (scene, group, config, done) => {
    const startTime = performance.now()
    const original = group.scale.clone()
    const tick = () => {
      const elapsed = performance.now() - startTime
      if (elapsed >= config.duration) { group.scale.copy(original); done(); return }
      const t = elapsed / config.duration
      group.scale.x = original.x * (1 + Math.sin(t * Math.PI) * 0.8)
      group.scale.z = original.z * (1 - Math.sin(t * Math.PI) * 0.3)
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },
  shadow_rise: (scene, group, config, done) => {
    const geo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 6)
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.particleColor), transparent: true, opacity: 0.5 })
    const shadows: THREE.Mesh[] = []
    for (let i = 0; i < 5; i++) {
      const s = new THREE.Mesh(geo, mat.clone())
      s.position.set((Math.random() - 0.5) * 2, -0.1, (Math.random() - 0.5) * 2)
      scene.add(s)
      shadows.push(s)
    }
    const startTime = performance.now()
    const tick = () => {
      const elapsed = performance.now() - startTime
      if (elapsed >= config.duration) { shadows.forEach(s => scene.remove(s)); done(); return }
      const t = elapsed / config.duration
      shadows.forEach(s => { s.scale.y = t * 15; s.position.y = t * 0.5 - 0.1 })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },
}

// Fallback for any unlisted type
export function getAnimation(type: ClickActionType): AnimationFn {
  return CLICK_ANIMATIONS[type] ?? CLICK_ANIMATIONS.power_up_aura!
}
