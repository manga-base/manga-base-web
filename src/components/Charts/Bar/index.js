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
      }}
      keys={["value"]}
      indexBy="nota"
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "nota",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "value",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
