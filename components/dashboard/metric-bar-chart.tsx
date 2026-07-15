"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_INK, CHART_SEQUENTIAL, CHART_SURFACE } from "@/lib/chart-colors";
import { useChartTheme } from "@/hooks/use-chart-theme";

interface MetricBarChartProps {
  title: string;
  data: { label: string; value: number }[];
  valueSuffix?: string;
  layout?: "vertical" | "horizontal";
  summary: string;
}

export function MetricBarChart({
  title,
  data,
  valueSuffix = "",
  layout = "horizontal",
  summary,
}: MetricBarChartProps) {
  const theme = useChartTheme();
  const barColor = CHART_SEQUENTIAL[theme];
  const gridColor = CHART_INK.grid[theme];
  const inkColor = CHART_INK.secondary[theme];
  const surfaceColor = CHART_SURFACE[theme];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Henüz veri yok.</p>
        ) : (
          <>
            <div className="h-64 w-full" role="img" aria-label={summary}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout={layout === "vertical" ? "vertical" : "horizontal"}
                  margin={{ top: 4, right: 12, bottom: 4, left: layout === "vertical" ? 12 : 0 }}
                >
                  <CartesianGrid
                    stroke={gridColor}
                    strokeDasharray="0"
                    horizontal={layout !== "vertical"}
                    vertical={layout === "vertical"}
                  />
                  {layout === "vertical" ? (
                    <>
                      <XAxis type="number" stroke={inkColor} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        stroke={inkColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={140}
                      />
                    </>
                  ) : (
                    <>
                      <XAxis
                        dataKey="label"
                        stroke={inkColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke={inkColor} fontSize={12} tickLine={false} axisLine={false} />
                    </>
                  )}
                  <Tooltip
                    cursor={{ fill: gridColor, opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: surfaceColor,
                      border: `1px solid ${gridColor}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value}${valueSuffix}`, ""]}
                  />
                  <Bar dataKey="value" fill={barColor} radius={[4, 4, 4, 4]} maxBarSize={28} />
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
