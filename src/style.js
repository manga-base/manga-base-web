import { createStyles, makeStyles } from "@material-ui/core";

const useGlobalStyle = makeStyles(
  (theme) =>
    createStyles({
      mainApp: {
        padding: "64px 0",
      },
      mainContainer: {
        maxWidth: "80%",
        margin: "1.75rem auto",
        [theme.breakpoints.down("md")]: {
          maxWidth: "100%",
        },
      },
      flexContainer: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      },
      centerText: {
        textAlign: "center",
      },
    }),
  { classNamePrefix: "MangaBase" }
);

export default useGlobalStyle;
