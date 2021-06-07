import { useTheme } from "@material-ui/core";
import { ResponsiveBar } from "@nivo/bar";

const Bar = ({ data }) => {
  const theme = useTheme();
  const colors = [theme.palette.primary.main, theme.palette.secondary.main];

  return (
    <ResponsiveBar
      data={data}
      {...{
        data,
        colors,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: { from: "color", modifiers: [["darker", 1.6]] },
        enableGridY: false
      }}
      keys={["value"]}
      indexBy="nota"
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      padding={0.2}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickRotation: 0,
        legend: "Puntuación",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickRotation: 0,
        legend: "Num. mangas",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
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

export default Bar;
