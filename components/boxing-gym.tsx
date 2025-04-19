"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment, useKeyboardControls, KeyboardControls, Text } from "@react-three/drei"
import { Physics, RigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { Avatar } from "./avatar"

export default function BoxingGym() {
  const [gender, setGender] = useState("male")
  const [height, setHeight] = useState(1)
  const [weight, setWeight] = useState(1)

  return (
    <div className="h-[600px] lg:h-[calc(100vh-12rem)]">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
          { name: "punch", keys: ["p", "P"] },
        ]}
      >
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Physics>
            <GymScene />
            <PlayerAvatar gender={gender} height={height} weight={weight} />
          </Physics>
          <Environment preset="city" />
        </Canvas>
      </KeyboardControls>

      <div className="absolute bottom-4 left-4 bg-background/80 p-3 rounded-lg backdrop-blur-sm">
        <p className="text-sm font-medium">Controls:</p>
        <p className="text-xs text-muted-foreground">WASD / Arrow Keys: Move</p>
        <p className="text-xs text-muted-foreground">Space: Jump</p>
        <p className="text-xs text-muted-foreground">P: Punch</p>
        <p className="text-xs text-muted-foreground">Mouse: Look around</p>
      </div>
    </div>
  )
}

function PlayerAvatar({ gender, height, weight }) {
  const [position, setPosition] = useState([0, 1, 0])
  const [rotation, setRotation] = useState([0, 0, 0])
  const [isPunching, setIsPunching] = useState(false)
  const avatarRef = useRef()
  const [, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    if (!avatarRef.current) return

    const { forward, backward, left, right, jump, punch } = getKeys()

    // Handle movement
    const speed = 3 * delta
    const moveDirection = new THREE.Vector3(0, 0, 0)

    if (forward) moveDirection.z -= speed
    if (backward) moveDirection.z += speed
    if (left) moveDirection.x -= speed
    if (right) moveDirection.x += speed

    // Apply movement
    if (moveDirection.length() > 0) {
      moveDirection.normalize().multiplyScalar(speed)
      setPosition((prev) => [prev[0] + moveDirection.x, prev[1], prev[2] + moveDirection.z])

      // Set rotation based on movement direction
      if (moveDirection.x !== 0 || moveDirection.z !== 0) {
        const angle = Math.atan2(moveDirection.x, moveDirection.z)
        setRotation([0, angle, 0])
      }
    }

    // Handle punch
    if (punch && !isPunching) {
      setIsPunching(true)
      setTimeout(() => setIsPunching(false), 500)
    }
  })

  return (
    <RigidBody type="dynamic" position={position} rotation={rotation} ref={avatarRef}>
      <Avatar gender={gender} height={height} weight={weight} isPunching={isPunching} />
    </RigidBody>
  )
}

function GymScene() {
  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Boxing Ring */}
      <RigidBody type="fixed" position={[0, 0.1, -5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[6, 0.2, 6]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>

        {/* Ring ropes */}
        {[0.5, 1, 1.5].map((height, i) => (
          <group key={i}>
            <mesh position={[-3, height, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 6, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#ddd" />
            </mesh>
            <mesh position={[3, height, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 6, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#ddd" />
            </mesh>
            <mesh position={[0, height, -3]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 6, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#ddd" />
            </mesh>
            <mesh position={[0, height, 3]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 6, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#ddd" />
            </mesh>
          </group>
        ))}

        {/* Ring posts */}
        {[
          [-3, -3],
          [3, -3],
          [3, 3],
          [-3, 3],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 1, z]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
            <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </RigidBody>

      {/* Punching Bag */}
      <RigidBody type="dynamic" position={[5, 1.5, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 1.5, 8, 16]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Punching Bag Chain */}
      <mesh position={[5, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Speed Bag */}
      <RigidBody type="dynamic" position={[-5, 1.7, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* Speed Bag Mount */}
      <mesh position={[-5, 2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Gym Sign */}
      <Text position={[0, 4, -8]} rotation={[0, 0, 0]} fontSize={1} color="#ffffff" anchorX="center" anchorY="middle">
        POLKADOT BOXING GYM
      </Text>

      {/* Walls */}
      <RigidBody type="fixed">
        <mesh position={[0, 5, -10]} receiveShadow>
          <boxGeometry args={[20, 10, 0.2]} />
          <meshStandardMaterial color="#444" roughness={1} />
        </mesh>
        <mesh position={[-10, 5, 0]} receiveShadow>
          <boxGeometry args={[0.2, 10, 20]} />
          <meshStandardMaterial color="#444" roughness={1} />
        </mesh>
        <mesh position={[10, 5, 0]} receiveShadow>
          <boxGeometry args={[0.2, 10, 20]} />
          <meshStandardMaterial color="#444" roughness={1} />
        </mesh>
      </RigidBody>
    </>
  )
}
