"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"

export function Avatar({ gender, height, weight, isPunching = false }) {
  const groupRef = useRef()
  const armRightRef = useRef()
  const [punchAnimation, setPunchAnimation] = useState({ progress: 0, active: false })

  // Handle punch animation
  useEffect(() => {
    if (isPunching) {
      setPunchAnimation({ progress: 0, active: true })
    }
  }, [isPunching])

  useFrame((state, delta) => {
    if (punchAnimation.active) {
      setPunchAnimation((prev) => {
        const newProgress = prev.progress + delta * 5 // Speed of punch

        if (armRightRef.current) {
          // Forward punch motion (0 to 0.5 progress)
          if (newProgress < 0.5) {
            const punchForwardAngle = (-Math.PI / 2) * (newProgress * 2)
            armRightRef.current.rotation.x = punchForwardAngle
          }
          // Return motion (0.5 to 1 progress)
          else if (newProgress < 1) {
            const returnProgress = (newProgress - 0.5) * 2
            const punchReturnAngle = (-Math.PI / 2) * (1 - returnProgress)
            armRightRef.current.rotation.x = punchReturnAngle
          } else {
            // Reset
            armRightRef.current.rotation.x = 0
            return { progress: 0, active: false }
          }
        }

        return { progress: newProgress, active: true }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[weight * 0.5, height * 1, weight * 0.3]}>
        <capsuleGeometry args={[1, 2, 4, 8]} />
        <meshStandardMaterial color={gender === "male" ? "#3b82f6" : "#ec4899"} />
      </mesh>

      {/* Head */}
      <mesh position={[0, height * 1.8, 0]} scale={[0.4, 0.5, 0.4]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f5d0c5" />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-weight * 0.7, height * 0.8, 0]} scale={[0.2, height * 0.6, 0.2]}>
        <capsuleGeometry args={[1, 1.5, 4, 8]} />
        <meshStandardMaterial color={gender === "male" ? "#3b82f6" : "#ec4899"} />
      </mesh>

      {/* Right Arm (for punching) */}
      <group position={[weight * 0.7, height * 1.2, 0]} ref={armRightRef}>
        <mesh position={[0, -height * 0.4, 0]} scale={[0.2, height * 0.6, 0.2]}>
          <capsuleGeometry args={[1, 1.5, 4, 8]} />
          <meshStandardMaterial color={gender === "male" ? "#3b82f6" : "#ec4899"} />
        </mesh>

        {/* Boxing Glove */}
        <mesh position={[0, -height * 0.9, 0]} scale={[0.3, 0.3, 0.3]}>
          <boxGeometry args={[1, 1, 1.5]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-weight * 0.3, -height * 1.2, 0]} scale={[0.25, height * 0.8, 0.25]}>
        <capsuleGeometry args={[1, 1.5, 4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[weight * 0.3, -height * 1.2, 0]} scale={[0.25, height * 0.8, 0.25]}>
        <capsuleGeometry args={[1, 1.5, 4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  )
}
