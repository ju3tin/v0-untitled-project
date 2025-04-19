import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AvatarBuilder from "@/components/avatar-builder"
import BoxingGym from "@/components/boxing-gym"
import Leaderboard from "@/components/leaderboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">3D Avatar Builder</h1>
        <Link href="#leaderboard">
          <Button variant="outline" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Button>
        </Link>
      </header>

      <Tabs defaultValue="builder" className="flex-1">
        <TabsList className="w-full max-w-md mx-auto mt-4 grid grid-cols-2">
          <TabsTrigger value="builder">Avatar Builder</TabsTrigger>
          <TabsTrigger value="gym">Boxing Gym</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="flex-1">
          <AvatarBuilder />
        </TabsContent>

        <TabsContent value="gym" className="flex-1">
          <BoxingGym />
        </TabsContent>
      </Tabs>

      <section id="leaderboard" className="py-8 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Top NFT Fighters</h2>
          <Leaderboard />
        </div>
      </section>
    </main>
  )
}
