import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 64,
    width: "100%",
  },
  footerContent: {
    position: "relative",
    width: "100%",
    height: "inherit",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    position: "absolute",
    right: 10,
  },
}));

export default useStyle;
