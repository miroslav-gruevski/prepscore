// Signal Card Component
import { Card, CardContent } from "@/components/ui/card"

interface SignalCardProps {
  name: string
  score: number
  reason: string
}

export function SignalCard({ name, score, reason }: SignalCardProps) {
  const getColor = (score: number) => {
    if (score >= 8) return "bg-green-50 border-green-200 text-green-900"
    if (score >= 6) return "bg-yellow-50 border-yellow-200 text-yellow-900"
    return "bg-red-50 border-red-200 text-red-900"
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className={`border-2 ${getColor(score)}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm">{name}</h4>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/10
          </span>
        </div>
        <p className="text-sm opacity-80">{reason}</p>
      </CardContent>
    </Card>
  )
}

