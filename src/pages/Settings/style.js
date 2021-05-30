import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  input: {
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
  },
  textField: {
    width: 300,
  },
  inputContent: {
    display: "flex",
    flexWrap: "warp",
    alignItems: "stretch",
    marginTop: "-4px",
  },
  inputLabel: {
    letterSpacing: ".07272727em",
    fontSize: ".6875rem",
    fontWeight: "500",
    lineHeight: "1rem",
    textTransform: "uppercase",
    hyphens: "auto",
    wordBreak: "break-word",
    wordWrap: "break-word",
    margin: "0",
    padding: "0",
    width: "100%",
  },
  disabledTextField: {
    "& .MuiInputBase-root::before": {
      content: "none",
    },
    "& .MuiInputBase-root::after": {
      content: "none",
    },
  },
  inputFlex: {
    flexGrow: "1",
    flexShrink: "1",
    flexBasis: "0",
  },
  inputLabelContainer: {
    display: "flex",
    flexBasis: 156,
    minWidth: 156,
    alignItems: "center",
    marginRight: 24,
    paddingTop: 4,
  },
  inputField: {
    flexGrow: "1",
    flexShrink: "1",
    marginRight: 24,
  },
  inputEndItemContainer: {
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: 16,
    position: "relative",
  },
  inputAvatarContainer: {
    borderRadius: "50%",
    overflow: "hidden",
  },
  inputAvatar: {
    width: 60,
    height: 60,
  },
  sombraAvatar: {
    backgroundColor: "rgba(32,33,36,0.6)",
    bottom: 0,
    height: "33%",
    left: 0,
    position: "absolute",
    right: 0,
  },
  iconaSombra: {
    display: "block",
    margin: "auto",
  },
  dropzone: {
    "& .MuiDialogContent-root": {
      overflow: "hidden",
    },
  },
  dropzoneTitle: {
    fontSize: 20,
  },
  dropzoneText: {
    fontSize: "20pt",
  },
  sectionTitle: {
    marginBottom: 8,
  },
  section: {
    padding: "24px 12px 0",
    width: "100%",
  },
  sectionHeader: {
    padding: "24px 24px 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonMargin: { marginLeft: 5 },
  banner: {
    maxWidth: "100%",
    borderRadius: 4,
  },
  iconaBanner: {
    position: "absolute",
    backgroundColor: "rgba(32,33,36,0.6)",
    width: 50,
    height: 50,
    padding: 10,
    borderRadius: "50%",
  },
}));

export default useStyle;
