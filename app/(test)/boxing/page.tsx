// pages/model-viewer.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'

const Model = () => {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const loader = useRef(new FBXLoader())

  useEffect(() => {
    loader.current.load('/models/your-model.fbx', (object) => {
      setModel(object)
    })
  }, [])

  return model ? <primitive object={model} scale={0.01} /> : null
}

export default function ModelViewerPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 2, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
