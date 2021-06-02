import { Avatar, Box, Button, Container, Grid, TextField, Typography } from "@material-ui/core";
import { ContactMail } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useHistory } from "react-router";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const Contact = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const history = useHistory();
  const { usuario } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState((usuario && usuario.username) || "");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState((usuario && usuario.email) || "");
  const [emailError, setEmailError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajeError, setMensajeError] = useState(false);
  const [files, setFiles] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    try {
      [
        { field: name, fun: setNameError, label: "nombre" },
        { field: email, fun: setEmailError, label: "email" },
        { field: mensaje, fun: setMensajeError, label: "mensaje" },
      ].forEach(({ field, fun, label }) => {
        if (!field || field.trim().length < 1) {
          var msg = `Proporcióna un ${label} valido.`;
          fun(msg);
          throw new Error(msg);
        } else {
          formData.append(label, field);
          fun(false);
        }
      });
    } catch (error) {
      return error;
    }
    files.forEach((file, i) => {
      formData.append(`imagen-${i}`, file);
    });
    try {
      const { data } = await http.post(`/contacto/`, formData);
      enqueueSnackbar(data.mensaje || data.mensaje.toString(), {
        variant: data.correcta ? "success" : "error",
      });
      if (data.correcta) {
        history.push("/");
      }
    } catch (error) {
      enqueueSnackbar("Error al enviar el formulario", {
        variant: "error",
      });
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.formContainer}>
        <Avatar className={classes.avatar}>
          <ContactMail />
        </Avatar>
        <Typography component="h1" variant="h5">
          Contacta con nosotros
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            error={!!nameError}
            label="Nombre"
            name="nombre"
            value={name}
            autoFocus={!usuario}
            onChange={(event) => {
              setName(event.target.value);
            }}
            helperText={nameError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            error={!!emailError}
            label="Correo electrónico"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            error={!!mensajeError}
            label="Mensaje"
            name="mensaje"
            value={mensaje}
            multiline
            autoFocus={!!usuario}
            rows={4}
            rowsMax={8}
            onChange={(event) => {
              setMensaje(event.target.value);
            }}
            helperText={mensajeError}
          />
          <DropzoneArea
            onChange={(files) => setFiles(files)}
            dropzoneClass={classes.contactDropzone}
            showPreviews={true}
            showPreviewsInDropzone={false}
            previewText="Imágenes seleccionadas"
            acceptedFiles={["image/*"]}
            filesLimit={4}
            showAlerts={false}
            maxFileSize={2000000}
            onAlert={(message, variant) => enqueueSnackbar(message, { variant })}
            dropzoneText="Arrastra y suelta una foto aquí o haga clic"
            showFileNamesInPreview={false}
          />
          <Box mt={2} mb={2}>
            <Grid container justify="flex-end">
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </div>
    </Container>
  );
};

export default Contact;
