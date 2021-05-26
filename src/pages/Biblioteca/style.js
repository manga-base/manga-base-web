import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles(
  (theme) => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      margin: "0 24px",
    },
    title: {
      display: "flex",
      alignItems: "flex-end",
      [theme.breakpoints.down("md")]: {
        marginBottom: 16,
      },
    },
    filtersContainer: {
      width: 260,
      minWidth: 260,
    },
    filterModule: {
      marginLeft: 24,
      padding: "12px 24px 12px 0",
      "&:first-child": {
        marginTop: 29,
        paddingTop: 0,
        paddingBottom: 24,
      },
    },
    filterTitle: {
      marginBottom: 5,
    },
    mangaContainer: {
      width: "100%",
      margin: "29px 24px 0 0",
    },
  }),
  { classNamePrefix: "Biblioteca" }
);

export default useStyle;
