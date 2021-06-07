import { useTheme } from "@material-ui/core";
import { ResponsivePie } from "@nivo/pie";
import { animated } from "@react-spring/web";

const Pie = ({ data, arrows = false, noLegend = false, width = 500, height = 500 }) => {
  const theme = useTheme();
  data = data.sort(({ value: valueA }, { value: valueB }) => valueB - valueA);
  const margin = { top: 70, right: 70, bottom: 70, left: 70 };
  const colors = [theme.palette.primary.main, theme.palette.secondary.main];

  const defs = [];
  const random = (max, min) => Math.floor(Math.random() * max) + min;

  /**
   * GeneratorFunction
   *
   * Aleatoritzar patrons, però que no es repetesquin
   *
   */
  function* shuffle(array) {
    var i = array.length;
    while (i--) {
      yield array.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
    }
  }

  const patterns = shuffle(["patternDots", "patternSquares", "patternLines"]);

  const getRandomPattern = () => {
    const id = `pattern-${Math.random().toString(36).substr(2, 5)}`;
    const type = patterns.next().value;
    const options = type === "patternLines" ? { spacing: random(4, 6), rotation: random(0, 360), lineWidth: random(1, 7) } : { size: random(1, 12), padding: random(1, 5), stagger: Math.random() < 0.5 };
    const pattern = {
      id,
      type,
      ...options,
      background: "inherit",
      color: "rgba(255, 255, 255, 0.5)",
    };
    defs.push(pattern);
    return id;
  };

  const fill = data.map((v) => ({ match: { label: v.label }, id: getRandomPattern() }));

  const legends = !noLegend
    ? [
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 0,
          translateY: 0,
          itemsSpacing: 9,
          itemWidth: 15,
          itemHeight: 15,
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 19,
          symbolShape: "circle",
        },
      ]
    : [];

  return (
    <div style={{ width, height, margin: "auto", maxWidth: "90vw" }}>
      <ResponsivePie
        {...{
          data,
          id: "label",
          margin,
          colors,
          innerRadius: 0.5,
          padAngle: 3,
          cornerRadius: 4,
          defs,
          fill,
          enableArcLinkLabels: arrows,
          activeInnerRadiusOffset: 10,
          activeOuterRadiusOffset: 10,
          motionConfig: "wobbly",
          arcLinkLabelsThickness: 4,
          arcLinkLabelsTextColor: { from: "color" },
          arcLinkLabelsColor: { from: "color" },
          arcLabelsSkipAngle: 20,
          arcLabelsRadiusOffset: 0.55,
          arcLabelsTextColor: {
            from: "color",
            modifiers: [["darker", 0.6]],
          },
          arcLinkLabelsOffset: 2,
          arcLabelsComponent: ({ datum, label, style }) => (
            <animated.g transform={style.transform} style={{ pointerEvents: "none" }}>
              <circle fill={style.textColor} cy={6} r="2%" />
              <circle fill="#ffffff" stroke={datum.color} strokeWidth={2} r="3%" />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={style.textColor}
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                {label}
              </text>
            </animated.g>
          ),
          legends,
          theme: {
            textColor: "#ffffffb3",
            fontSize: 14,
            tooltip: {
              container: {
                background: "#333",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Pie;
