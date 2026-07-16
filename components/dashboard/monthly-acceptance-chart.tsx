"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_INK, CHART_STATUS, CHART_SURFACE } from "@/lib/chart-colors";
import { useChartTheme } from "@/hooks/use-chart-theme";
import type { DashboardMetrics } from "@/types/scoring";

interface MonthlyAcceptanceChartProps {
  data: DashboardMetrics["acceptanceRateByMonth"];
}

export function MonthlyAcceptanceChart({ data }: MonthlyAcceptanceChartProps) {
  const theme = useChartTheme();
  const gridColor = CHART_INK.grid[theme];
  const inkColor = CHART_INK.secondary[theme];
  const surfaceColor = CHART_SURFACE[theme];
  const goodColor = CHART_STATUS.good[theme];
  const criticalColor = CHART_STATUS.critical[theme];

  const hasData = data.some((item) => item.acceptedRate > 0 || item.rejectedRate > 0);
  const summary = hasData
    ? "Aylara göre kabul ve ret oranı yüzde olarak gösterilmiştir."
    : "Henüz veri yok.";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Aylara Göre Kabul ve Ret Oranı</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Henüz veri yok.</p>
        ) : (
          <>
            <div className="h-64 w-full" role="img" aria-label={summary}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="month" stroke={inkColor} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke={inkColor}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    cursor={{ fill: gridColor, opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: surfaceColor,
                      border: `1px solid ${gridColor}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: inkColor }} />
                  <Bar dataKey="acceptedRate" name="Kabul oranı" fill={goodColor} radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="rejectedRate" name="Ret oranı" fill={criticalColor} radius={[4, 4, 0, 0]} maxBarSize={18} />
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
