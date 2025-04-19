"use client"

import { useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, UserIcon as Male, UserIcon as Female } from "lucide-react"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import { Avatar } from "./avatar"

export default function AvatarBuilder() {
  const [gender, setGender] = useState("male")
  const [height, setHeight] = useState(1)
  const [weight, setWeight] = useState(1)
  const sceneRef = useRef()

  const handleDownload = () => {
    if (!sceneRef.current) return

    const exporter = new GLTFExporter()
    exporter.parse(
      sceneRef.current,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: "application/json" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `avatar-${gender}-h${height.toFixed(1)}-w${weight.toFixed(1)}.gltf`
        link.click()
      },
      { binary: false },
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
      <div className="lg:col-span-2 h-[500px] lg:h-[calc(100vh-12rem)]">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 1.5, 4]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <group ref={sceneRef}>
            <Avatar gender={gender} height={height} weight={weight} />
          </group>
          <OrbitControls />
          <Environment preset="city" />
        </Canvas>
      </div>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Avatar Customization</CardTitle>
            <CardDescription>Customize your 3D avatar for Polkadot NFT</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-2 block">Gender</Label>
              <Tabs defaultValue={gender} onValueChange={setGender} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="male" className="flex items-center gap-2">
                    <Male className="h-4 w-4" />
                    Male
                  </TabsTrigger>
                  <TabsTrigger value="female" className="flex items-center gap-2">
                    <Female className="h-4 w-4" />
                    Female
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Height</Label>
                  <span className="text-sm text-muted-foreground">{height.toFixed(1)}</span>
                </div>
                <Slider
                  value={[height]}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  onValueChange={(value) => setHeight(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Weight</Label>
                  <span className="text-sm text-muted-foreground">{weight.toFixed(1)}</span>
                </div>
                <Slider
                  value={[weight]}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  onValueChange={(value) => setWeight(value[0])}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download for NFT
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Polkadot NFT Integration</h3>
          <p className="text-sm text-muted-foreground">
            After downloading your 3D model, you can mint it as an NFT on Polkadot using platforms like RMRK, Unique
            Network, or Moonbeam. Connect your Polkadot wallet and follow the platform's instructions to upload your
            model.
          </p>
        </div>
      </div>
    </div>
  )
}
