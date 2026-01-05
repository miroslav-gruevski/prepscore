// Feedback Card Component
import { Card, CardContent } from "@/components/ui/card"

interface FeedbackCardProps {
  content: string
  type: "strength" | "improvement"
}

export function FeedbackCard({ content, type }: FeedbackCardProps) {
  const isStrength = type === "strength"

  return (
    <Card
      className={`border-l-4 ${
        isStrength
          ? "border-l-green-500 bg-green-50"
          : "border-l-amber-500 bg-amber-50"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 text-2xl">
            {isStrength ? "✅" : "💡"}
          </div>
          <p className="text-sm text-gray-800">{content}</p>
        </div>
      </CardContent>
    </Card>
  )
}

