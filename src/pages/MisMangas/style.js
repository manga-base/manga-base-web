import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  veritcalTabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    borderRadius: 4,
  },
  tabsLine: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 160,
  },
  tabPanelFullWidth: {
    width: "100%",
  },
}));

export default useStyle;
