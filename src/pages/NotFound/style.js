import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  NotFound: {
    fontWeight: "800",
    fontSize: 100,
  },
  notFoundContainer: {
    padding: 15,
    margin: "1.75rem auto",
    textAlign: "center",
  },
  notFoundRigth: {
    padding: "0 20px",
    [theme.breakpoints.up("sm")]: {
      borderLeft: "0.07rem solid rgba(255, 255, 255, 0.12)",
    },
  },
  goHomeButton: {
    marginTop: 10,
  },
  imageContainer: {
    position: "relative",
  },
  notFoundText: {
    fontWeight: "500",
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    color: "rgba(255, 255, 255, 0.3)",
  },
}));

export default useStyle;
