import { useMemo, useState } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { GradientTealBlue } from '@visx/gradient';
import letterFrequency, { LetterFrequency } from '@visx/mock-data/lib/mocks/letterFrequency';
import { scaleBand, scaleLinear } from '@visx/scale';

const data = letterFrequency.slice(5);
const verticalMargin = 120;

// accessors
const getLetter = (d: LetterFrequency) => d.letter;
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100;

export type BarsProps = {
  width: number;
  height: number;
  events?: boolean;
};

export default function BarChart({ width, height, events = false }: BarsProps) {
  // State for tooltip
  const [tooltipData, setTooltipData] = useState<LetterFrequency | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState<number>(0);
  const [tooltipTop, setTooltipTop] = useState<number>(0);

  // bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getLetter),
        padding: 0.4,
      }),
    [xMax],
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getLetterFrequency))],
      }),
    [yMax],
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <GradientTealBlue id="teal" />
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const letter = getLetter(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getLetterFrequency(d)) ?? 0);
          const barX = xScale(letter);
          const barY = yMax - barHeight;

          return (
            <Bar
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(23, 233, 217, .5)"
              onMouseOver={(event) => {
                const { clientX, clientY } = event;
                setTooltipData(d);
                setTooltipLeft(clientX);
                setTooltipTop(clientY);
              }}
              onMouseOut={() => {
                setTooltipData(null);
              }}
            />
          );
        })}
      </Group>

      {/* Tooltip */}
      {tooltipData && (
        <g>
          <rect
            x={tooltipLeft}
            y={tooltipTop - 40}
            fill="white"
            opacity={0.8}
            stroke="rgba(23, 233, 217, .5)"
            rx={4}
            ry={4}
          />
          <text
            x={tooltipLeft + 5}
            y={tooltipTop - 20}
            fill="black"
            fontSize={12}
            pointerEvents="none"
          >
            {`${getLetter(tooltipData)}: ${getLetterFrequency(tooltipData)}`}
          </text>
        </g>
      )}
    </svg>
  );
}