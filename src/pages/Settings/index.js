import { Box, Container, Divider, Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { useState } from "react";
import "./style.css";

const useStyle = makeStyles((theme) => ({
  input: {
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
  },
  label: {
    width: 160,
    fontSize: 12,
    textTransform: "uppercase",
  },
  textField: {
    width: 300,
  },
}));

const Settings = () => {
  const classes = useStyle();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [biografia, setBiografia] = useState();
  const [avatar, setAvatar] = useState();

  const inputs = [
    {
      label: "Nombre de usuario",
      value: username,
      setFun: setUsername,
      type: "text",
    },
    {
      label: "Correo electronico",
      value: email,
      setFun: setEmail,
      type: "email",
    },
    {
      label: "Contrasenya",
      value: password,
      setFun: setPassword,
      type: "password",
    },
    {
      label: "biografia",
      value: biografia,
      setFun: setBiografia,
      type: "text",
      multiline: true,
      rows: 4,
    },
  ];

  const Input = ({ label, value, setFun, type, multiline, rows }) => (
    <>
      <div className={classes.input} key={label}>
        <Typography color="textSecondary" className={classes.label}>
          {label}
        </Typography>
        <TextField
          {...{
            type,
            value,
            multiline,
            rows,
          }}
          onChange={(e, v) => {
            setFun(v);
          }}
          className={classes.textField}
        />
      </div>
      <Divider variant="middle" />
    </>
  );

  const Inputs = () => inputs.map((props) => <Input key={props.label} {...props} />);

  return (
    <Container>
      <Typography variant="h3">Ajustes</Typography>
      <Grid container direction="column" alignItems="center">
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          Información básica
        </Typography>
        <Typography color="textSecondary">Información básica, como el correo electronico y la foto</Typography>
        <div style={{ padding: "24px 12px 0", width: "100%" }}>
          <Box border={1} borderRadius={16} style={{ width: "80%", padding: 24, margin: "auto" }}>
            <Typography variant="h5">Información personal</Typography>
            <Typography color="textSecondary">Información básica, como el correo electronico y la foto</Typography>
            <Inputs />
            <div className={classes.input}>
              <Typography color="textSecondary" className={classes.label}>
                Avatar
              </Typography>
              <DropzoneArea
                onChange={(e, v) => {
                  setAvatar(v);
                }}
                acceptedFiles={["image/*"]}
                showPreviewsInDropzone={true}
                filesLimit={1}
                showAlerts={false}
                dropzoneText="Arrastra y suelta un archivo aquí o haga clic"
              />
            </div>
            <Divider variant="middle" />
          </Box>
        </div>
      </Grid>
    </Container>
  );
};

export default Settings;
