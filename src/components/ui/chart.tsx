"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showTooltip?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  type?: "line" | "bar"
}

export function Chart({
  data,
  index,
  categories,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 60,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  type = "line",
  className,
  ...props
}: ChartProps) {
  const ChartComponent = type === "line" ? LineChart : BarChart

  return (
    <div className={cn("h-[350px] w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
          )}
          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              width={yAxisWidth}
              tickFormatter={valueFormatter}
            />
          )}
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {label}
                          </span>
                          {payload.map((entry: any, index: number) => (
                            <span key={index} className="font-bold text-muted-foreground">
                              {valueFormatter(entry.value)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              content={({ payload }) => {
                return (
                  <div className="flex items-center justify-center space-x-4">
                    {payload?.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          )}
          {categories.map((category, i) => {
            if (type === "line") {
              return (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[i % colors.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )
            } else {
              return (
                <Bar
                  key={category}
                  dataKey={category}
                  fill={colors[i % colors.length]}
                />
              )
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
} 