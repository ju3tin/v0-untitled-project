import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    name: "KnockoutKing",
    avatar: "/placeholder.svg?height=40&width=40",
    wins: 42,
    losses: 3,
    nftValue: "1,240 DOT",
  },
  {
    id: 2,
    name: "PunchMaster",
    avatar: "/placeholder.svg?height=40&width=40",
    wins: 38,
    losses: 5,
    nftValue: "980 DOT",
  },
  {
    id: 3,
    name: "BoxerQueen",
    avatar: "/placeholder.svg?height=40&width=40",
    wins: 36,
    losses: 7,
    nftValue: "850 DOT",
  },
  {
    id: 4,
    name: "FightClub",
    avatar: "/placeholder.svg?height=40&width=40",
    wins: 32,
    losses: 10,
    nftValue: "720 DOT",
  },
  {
    id: 5,
    name: "RingMaster",
    avatar: "/placeholder.svg?height=40&width=40",
    wins: 29,
    losses: 11,
    nftValue: "650 DOT",
  },
]

export default function Leaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <Avatar>
                  <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                  <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.wins} W - {player.losses} L
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  {player.nftValue}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
