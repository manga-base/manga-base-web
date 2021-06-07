import { useTheme } from "@material-ui/core";
import { ResponsiveLine } from "@nivo/line";

const Line = ({ data }) => {
  const theme = useTheme();
  const colors = [theme.palette.primary.main, theme.palette.secondary.main];

  return (
    <ResponsiveLine
      {...{
        data,
        colors,
        curve: "monotoneX",
        lineWidth: 4,
        enableArea: true,
        areaBaselineValue: 0,
        enablePointLabel: true,
        enableGridX: false,
        enableGridY: false,
        pointSize: 12,
        gridYValues: [0, 1, 2, 3, 4, 5, 6],
      }}
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={null}
      useMesh={true}
      sliceTooltip={({ slice }) => {
        return (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
            }}
          >
            <div>x: {slice.id}</div>
            {slice.points.map((point) => (
              <div
                key={point.id}
                style={{
                  color: point.serieColor,
                  padding: "3px 0",
                }}
              >
                <strong>{point.serieId}</strong> [{point.data.yFormatted}]
              </div>
            ))}
          </div>
        );
      }}
      theme={{
        textColor: "#ffffffb3",
        fontSize: 14,
        tooltip: {
          container: {
            background: "#333",
          },
        },
      }}
    />
  );
};

export default Line;
