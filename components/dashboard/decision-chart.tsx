"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_INK, CHART_SURFACE, DECISION_CHART_COLORS } from "@/lib/chart-colors";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { DECISION_LABELS } from "@/lib/labels";
import type { DashboardMetrics } from "@/types/scoring";

interface DecisionChartProps {
  distribution: DashboardMetrics["decisionDistribution"];
}

export function DecisionChart({ distribution }: DecisionChartProps) {
  const theme = useChartTheme();
  const gridColor = CHART_INK.grid[theme];
  const inkColor = CHART_INK.secondary[theme];
  const surfaceColor = CHART_SURFACE[theme];

  const data = distribution.map((item) => ({
    label: DECISION_LABELS[item.decision],
    value: item.count,
    decision: item.decision,
  }));

  const total = distribution.reduce((sum, item) => sum + item.count, 0);
  const summary =
    total === 0
      ? "Henüz veri yok."
      : data.map((item) => `${item.label}: ${item.value}`).join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Karar Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Henüz veri yok.</p>
        ) : (
          <>
            <div className="h-64 w-full" role="img" aria-label={summary}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="label" stroke={inkColor} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={inkColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: gridColor, opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: surfaceColor,
                      border: `1px solid ${gridColor}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]} maxBarSize={40}>
                    {data.map((item) => (
                      <Cell key={item.decision} fill={DECISION_CHART_COLORS[item.decision][theme]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{summary}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
