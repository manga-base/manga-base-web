import { makeStyles } from "@material-ui/core";

const spinewidth = "0.13rem";
const backgroundAccent = "rgba(255, 255, 255, 0.7)";

const useStyle = makeStyles((theme) => ({
  commentDate: {
    fontSize: 12,
    letterSpacing: 0.3,
    lineHeight: "1.8rem",
  },
  commentText: {
    fontSize: 14,
    whiteSpace: "pre-line",
  },
  thumbButton: {
    padding: 8,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  popupIcon: {
    margin: "0 1rem 0 0.3rem",
  },
  commentLine: {
    position: "absolute",
    height: "100%",
    left: 35,
    clip: "rect(50px, 10px, 99999vh, 0px)",
    transition: "border-left-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    borderLeft: "1px solid rgba(255, 255, 255, 0.7)",
    "&:hover": {
      borderLeft: "2px solid #8fb339",
    },
  },
  commentFrom: {
    marginBottom: 4,
    display: "flex",
    alignItems: "center",
    fontSize: "0.875rem",
    lineHeight: "1.125rem",
    position: "relative",
    "&::before": {
      content: `""`,
      display: "block",
      position: "absolute",
      boxSizing: "border-box",
      top: "50%",
      right: "100%",
      bottom: 0,
      left: `calc(-1 * (40px / 2 + 16px))`,
      marginTop: `calc(-1 * ${spinewidth} / 2)`,
      marginLeft: `calc(-1 * ${spinewidth} / 2)`,
      marginBottom: "calc(0.125rem - 4px)",
      marginRight: 4,
      borderLeft: `${spinewidth} solid ${backgroundAccent}`,
      borderTop: `${spinewidth} solid ${backgroundAccent}`,
      borderBottom: `0 solid ${backgroundAccent}`,
      borderRight: `0 solid ${backgroundAccent}`,
      borderTopLeftRadius: 6,
    },
  },
  smallAvatar: {
    width: 18,
    height: 18,
    marginRight: "0.25rem",
  },
  commentHeader: {
    display: "block",
    position: "relative",
    lineHeight: "1.375rem",
    fontSize: "1.325rem",
    minHeight: "1.375rem",
    padding: 0,
    border: 0,
    margin: 0,
    whiteSpace: "break-spaces",
  },
  commentUsername: {
    marginRight: "0.25rem",
    outline: 0,
    fontSize: "1rem",
    fontWeight: "500",
    lineHeight: "1.375rem",
    color: "#fff",
    display: "inline",
    verticalAlign: "baseline",
    position: "relative",
    overflow: "hidden",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  commentTime: {
    fontSize: "0.75rem",
    lineHeight: "1.375rem",
    marginLeft: "0.25rem",
    height: "1.25rem",
    fontWeight: "500",
  },
  thumbIcon: {
    width: 16,
    height: 16,
  },
}));

export default useStyle;
