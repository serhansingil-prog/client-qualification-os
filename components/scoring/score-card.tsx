import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  description?: string;
}

export function ScoreCard({ title, score, maxScore, description }: ScoreCardProps) {
  const percentage = maxScore === 0 ? 0 : Math.max(0, Math.min(100, (score / maxScore) * 100));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight">{score}</span>
          <span className="text-sm text-muted-foreground">/ {maxScore}</span>
        </div>
        <Progress value={percentage} className="mt-3" aria-label={`${title}: ${score} / ${maxScore}`} />
        {description ? <p className="mt-2 text-xs text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  );
}
