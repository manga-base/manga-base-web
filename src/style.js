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
        "&.largeMargin": {
          maxWidth: "52%",
        },
        [theme.breakpoints.down("md")]: {
          maxWidth: "100%",
          "&.largeMargin": {
            maxWidth: "100%",
          },
        },
      },
      flex: {
        display: "flex",
      },
      flexContainer: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      },
      centerText: {
        textAlign: "center",
      },
      mangaRating: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      },
      mangaRatingNumber: {
        marginRight: 4,
      },
      commentContainer: {
        position: "relative",
        height: "auto",
        width: "100%",
        padding: "2px 48px 2px 72px",
        border: 0,
        margin: "17px 0 0",
      },
      commentContent: {
        position: "static",
        padding: 0,
        border: 0,
        margin: 0,
      },
      commentAvatar: {
        position: "absolute",
        left: 16,
        marginTop: "calc(4px - 0.125rem)",
        width: 40,
        height: 40,
      },
      commentAvatarResponse: {
        width: 30,
        height: 30,
      },
      commentBody: {
        userSelect: "text",
        marginLeft: "-72px",
        paddingLeft: "72px",
        overflow: "hidden",
        position: "relative",
        fontSize: "0.835rem",
        lineHeight: "1.375rem",
        whiteSpace: "break-spaces",
        wordWrap: "break-word",
        fontWeight: "400",
      },
      title: {
        display: "flex",
        alignItems: "flex-end",
        [theme.breakpoints.down("md")]: {
          marginBottom: 16,
        },
      },
    }),
  { classNamePrefix: "MangaBase" }
);

export default useGlobalStyle;
