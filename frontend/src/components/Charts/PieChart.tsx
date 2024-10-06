import { useState, useMemo } from "react";
import Pie, { ProvidedProps, PieArcDatum } from "@visx/shape/lib/shapes/Pie";
import { scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { animated, useTransition, interpolate } from "@react-spring/web";

const generateAnalogousColors = (numColors: number) => {
  const colors = [];
  const baseHue = Math.floor(Math.random() * 360);

  const range = 30;

  for (let i = 0; i < numColors; i++) {
    const hue =
      (baseHue + (i - Math.floor(numColors / 2)) * (range / numColors)) % 360;
    const color = `hsl(${hue}, 70%, 60%)`;
    colors.push(color);
  }
  return colors;
};

const generateHarmoniousColors = (numColors: number) => {
  const colors = [];
  const baseHue = Math.random() * 360;
  const hueStep = 360 / numColors;

  for (let i = 0; i < numColors; i++) {
    const hue = (baseHue + i * hueStep) % 360;
    const color = `hsl(${hue}, 70%, 50%)`;
    colors.push(color);
  }
  return colors;
};

interface PieData {
  label: string;
  value: number;
}

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export default function PieChart({
  width,
  height,
  data,
  margin = defaultMargin,
  animate = true,
}: {
  width: number;
  height: number;
  data: PieData[];
  margin?: typeof defaultMargin;
  animate?: boolean;
}) {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;

  const colors = useMemo(() => generateHarmoniousColors(data.length), [data]);

  const getPieColor = scaleOrdinal({
    domain: data.map(({ label }) => label),
    range: colors,
  });

  return (
    <svg width={width} height={height}>
      <Group
        top={innerHeight / 2 + margin.top}
        left={innerWidth / 2 + margin.left}
      >
        <Pie
          data={
            selectedSlice
              ? data.filter(({ label }) => label === selectedSlice)
              : data
          }
          pieValue={(d: PieData) => d.value}
          outerRadius={radius}
          innerRadius={0}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie<PieData>
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.label}
              onClickDatum={({ data: { label } }) =>
                animate &&
                setSelectedSlice(
                  selectedSlice && selectedSlice === label ? null : label
                )
              }
              getColor={(arc) => getPieColor(arc.data.label)}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
}

// React Spring Transition Definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

// Animated Pie Component
type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}
