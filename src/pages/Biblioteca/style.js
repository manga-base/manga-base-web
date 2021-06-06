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
    bibliotecaContent: {
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
    },
  }),
  { classNamePrefix: "Biblioteca" }
);

export default useStyle;
