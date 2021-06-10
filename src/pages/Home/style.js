import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  paperHome: {
    margin: "1.7rem auto",
    padding: 15,
    textAlign: "center",
    whiteSpace: "break-spaces",
  },
  paddingTop: {
    paddingTop: 18,
  },
  paddingBottom: {
    paddingBottom: 18,
  },
  cardGrid: {
    paddingTop: 35,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  card: {
    width: 400,
    minWidth: 350,
    boxShadow: "none",
  },
  card1: {
    width: 350,
    minWidth: 350,
    boxShadow: "none",
  },
  largerIcon: {
    fontSize: 80,
  },
  bodyText: {
    marginTop: 15,
    textAlign: "justify",
  },
  largeAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    backgroundColor: "#fff",
  },
}));

export default useStyle;
