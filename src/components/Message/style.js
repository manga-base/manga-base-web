import { makeStyles } from "@material-ui/core";

const spacing = 15;

const useStyle = makeStyles((theme) => ({
  messageContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: spacing,
    margin: "16px 8px 8px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4,
  },
  messageHeader: {
    width: "100%",
    position: "relative",
    minHeight: 75,
  },
  messageNameBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  messageId: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  messageDate: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  messageContent: {
    marginTop: spacing,
  },
  messageMedia: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: spacing,
    marginTop: spacing,
  },
  messageImage: {
    width: 100,
    height: "auto",
  },
  mesageFooter: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    gap: 5,
    marginTop: spacing,
  },
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    alignItems: "center",
    display: "block",
  },
  textDiv: {
    display: "flex",
  },
  column: {
    flexBasis: "33.33%",
  },
  doubleColumn: {
    flexBasis: "66.66%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  fotosContainer: {
    marginTop: spacing,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  bigImage: {
    maxHeight: "100vh",
    margin: "auto",
  },
}));

export default useStyle;
