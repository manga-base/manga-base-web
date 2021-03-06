import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  largeAvatar: {
    position: "absolute",
    top: 240,
    width: theme.spacing(18),
    height: theme.spacing(18),
    border: "10px solid",
    borderColor: theme.palette.background.paper,
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  box: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    marginTop: "1.75rem",
    borderRadius: 4,
  },
  backgroundTitle: {
    backgroundColor: theme.palette.primary.main,
    color: "#000",
    borderRadius: "4px 4px 0 0",
    width: "100%",
    padding: 5,
  },
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  avatarElevation: {
    boxShadow: theme.shadows[3],
  },
  listItem: {
    width: "auto",
  },
  activityHistoryGridItem: {
    height: 250,
  },
  vacioText: {
    padding: 10,
  },
  banner: {
    height: 240,
  },
  TabListAppBar: {
    marginTop: "1.75rem",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  statusList: {
    height: "95%",
    width: 6,
    position: "absolute",
    left: 0,
    top: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  statsList: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row",
    padding: 0,
    margin: "0 0 24px",
    justifyContent: "space-around",
  },
  statsDivider: {
    marginBottom: 24,
  },
  commentPaper: {
    marginTop: "1.75rem",
    padding: "5px 0",
  },
  titleSocial: {
    margin: theme.spacing(1, 0, 2),
  },
  teSigueChip: {
    marginLeft: 5,
  },
  siguiendoButton: {
    "&:hover": {
      backgroundColor: "#f44336",
    },
  },
}));

export default useStyle;
