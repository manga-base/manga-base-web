import { Avatar, Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Fade, Grid, IconButton, InputAdornment, ListItem, Modal, TextField, Typography } from "@material-ui/core";
import { CameraAlt, Close, Visibility, VisibilityOff } from "@material-ui/icons";
import SettingsIcon from "@material-ui/icons/Settings";
import { DropzoneDialog } from "material-ui-dropzone";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useHistory } from "react-router";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const Settings = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { enqueueSnackbar } = useSnackbar();
  const { usuario, update, logout } = useUser();
  const history = useHistory();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [openAvatarDropzone, setOpenAvatarDropzone] = useState(false);
  const [openBannerDropzone, setOpenBannerDropzone] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [username, setUsername] = useState(usuario.username);
  const [usernameError, setUsernameError] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState(usuario.birthdayDate || "");
  const [fechaNacimientoError, setFechaNacimientoError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [biografia, setBiografia] = useState(usuario.biografia);
  const [biografiaError, setBiografiaError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");

  const [usernameDeleteConfirmation, setUsernameDeleteConfirmation] = useState("");
  const [passwordDeleteConfirmation, setPasswordDeleteConfirmation] = useState("");
  const [passwordDeleteConfirmationError, setPasswordDeleteConfirmationError] = useState(false);

  const avatarSrc = avatar || `${imgUrl}avatars/${usuario.avatar}`;
  const bannerSrc = banner || `${imgUrl}banners/${usuario.banner}`;

  const handleSaveAvatar = async (files) => {
    setAvatar(window.URL.createObjectURL(files[0]));
    setOpenAvatarDropzone(false);
    var formData = new FormData();
    formData.append("avatar", files[0]);
    try {
      const response = await http.post(`/usuario/avatar`, formData);
      const { data } = response;
      if (data.correcta) {
        enqueueSnackbar("Para poder ver los cambios inmediatamente vuelva a iniciar sessión.", {
          variant: "info",
        });
      }
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
      });
    } catch (error) {
      enqueueSnackbar("Error al enviar el avatar", {
        variant: "error",
      });
    }
  };

  const handleSaveBanner = async (files) => {
    setBanner(window.URL.createObjectURL(files[0]));
    setOpenBannerDropzone(false);
    var formData = new FormData();
    formData.append("banner", files[0]);
    try {
      const { data } = await http.post(`/usuario/banner`, formData);
      if (data.correcta) {
        enqueueSnackbar("Para poder ver los cambios inmediatamente vuelva a iniciar sessión.", {
          variant: "info",
        });
      }
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
      });
    } catch (error) {
      enqueueSnackbar("Error al enviar el banner", {
        variant: "error",
      });
    }
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setUsername(usuario.username);
    setUsernameError(false);
    setFechaNacimiento(usuario.birthdayDate || "");
    setFechaNacimientoError(false);
    setPassword("");
    setPasswordError(false);
    setShowPassword(false);
    setBiografia(usuario.biografia);
    setBiografiaError(false);
  };

  const handelSubmit = async (e) => {
    try {
      [
        { field: password, fun: setPasswordError, msg: "Proporcióna una contrasenya valida para enviar el formulario." },
        { field: username, fun: setUsernameError, msg: "Proporcióna un nombre de usuario valido." },
      ].forEach(({ field, fun, msg }) => {
        if (!field || field.trim().length < 1) {
          fun(msg);
          e.preventDefault();
          throw new Error(msg);
        } else {
          fun(false);
          setBiografiaError(false);
        }
      });
    } catch (error) {
      return error;
    }

    let body = {
      username,
      password,
      biografia,
    };
    if (fechaNacimiento) body.birthdayDate = fechaNacimiento;
    var error = await update(body);
    if (error) {
      const { field, msg } = error;
      switch (field) {
        case "username":
          setUsernameError(msg);
          break;
        case "password":
          setPasswordError(msg);
          break;
        case "biografia":
          setBiografiaError(msg);
          break;
        default:
          enqueueSnackbar(msg, {
            variant: "error",
          });
          break;
      }
    } else {
      setModoEdicion(false);
      enqueueSnackbar("Información modificada correctamente", { variant: "success" });
    }
  };

  const deleteAccount = async () => {
    if (!passwordDeleteConfirmation || passwordDeleteConfirmation.trim().length < 1) {
      setPasswordDeleteConfirmationError("Proporcióna una contrasenya valida.");
      return;
    } else {
      setPasswordDeleteConfirmationError(false);
    }
    try {
      const { data } = await http.post(`/usuario/delete/${usuario.id}`, { password: passwordDeleteConfirmation });
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
      });
      if (data.correcta) {
        logout();
        history.push("/");
      }
    } catch (error) {
      enqueueSnackbar("Error al enviar el banner", {
        variant: "error",
      });
    }
  };

  const onCloseModal = () => {
    setUsernameDeleteConfirmation("");
    setPasswordDeleteConfirmation("");
    setOpenModal(false);
  };

  return (
    <div className={classes.mainContainer + " largeMargin"}>
      <div className={classes.title}>
        <SettingsIcon fontSize="large" color="primary" />
        <Typography variant="h4">Ajustes</Typography>
      </div>
      <Grid container direction="column" alignItems="center">
        <div className={classes.section}>
          <Box border={1} borderRadius={16}>
            <div className={[classes.sectionHeader, classes.headerFlex].join(" ")}>
              <Typography variant="h5">Información básica</Typography>
              <div>
                <Button variant="contained" color="primary" onClick={modoEdicion ? handelSubmit : () => setModoEdicion(!modoEdicion)}>
                  {modoEdicion ? "Guardar" : "Editar"}
                </Button>
                {modoEdicion && (
                  <Button className={classes.buttonMargin} onClick={handleCancelarEdicion}>
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
            <div className={classes.input}>
              <div className={classes.inputFlex}>
                <div className={classes.inputContent}>
                  <div className={classes.inputLabelContainer}>
                    <Typography className={classes.inputLabel} color="textSecondary">
                      Nombre de usuario
                    </Typography>
                  </div>
                  <div className={classes.inputField}>
                    <TextField
                      type="text"
                      value={username}
                      fullWidth
                      className={!modoEdicion ? classes.disabledTextField : ""}
                      disabled={!modoEdicion}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      error={!!usernameError}
                      helperText={usernameError}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider variant="middle" />
            <div className={classes.input}>
              <div className={classes.inputFlex}>
                <div className={classes.inputContent}>
                  <div className={classes.inputLabelContainer}>
                    <Typography className={classes.inputLabel} color="textSecondary">
                      Fecha de nacimiento
                    </Typography>
                  </div>
                  <div className={classes.inputField}>
                    <TextField
                      type="date"
                      value={fechaNacimiento}
                      className={!modoEdicion ? classes.disabledTextField : ""}
                      disabled={!modoEdicion}
                      onChange={(e) => {
                        setFechaNacimiento(e.target.value);
                      }}
                      fullWidth={!fechaNacimiento}
                      error={!!fechaNacimientoError}
                      helperText={fechaNacimientoError}
                    />
                  </div>
                </div>
              </div>
              <div className={classes.inputEndItemContainer}>
                {modoEdicion && fechaNacimiento && (
                  <Button
                    onClick={(e) => {
                      setFechaNacimiento("");
                    }}
                    variant="contained"
                  >
                    Borrar fecha
                  </Button>
                )}
              </div>
            </div>
            <Divider variant="middle" />
            <div className={classes.input}>
              <div className={classes.inputFlex}>
                <div className={classes.inputContent}>
                  <div className={classes.inputLabelContainer}>
                    <Typography className={classes.inputLabel} color="textSecondary">
                      Contrasenya
                    </Typography>
                  </div>
                  <div className={classes.inputField}>
                    <TextField
                      value={password}
                      fullWidth
                      className={!modoEdicion ? classes.disabledTextField : ""}
                      disabled={!modoEdicion}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      error={!!passwordError}
                      helperText={passwordError}
                      placeholder={!modoEdicion ? "• • • • • • • •" : ""}
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {modoEdicion && (showPassword ? <Visibility /> : <VisibilityOff />)}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider variant="middle" />
            <div className={classes.input}>
              <div className={classes.inputFlex}>
                <div className={classes.inputContent}>
                  <div className={classes.inputLabelContainer}>
                    <Typography className={classes.inputLabel} color="textSecondary">
                      Biografia
                    </Typography>
                  </div>
                  <div className={classes.inputField}>
                    <TextField
                      type="text"
                      value={biografia}
                      fullWidth
                      multiline
                      rowsMax={4}
                      className={!modoEdicion ? classes.disabledTextField : ""}
                      disabled={!modoEdicion}
                      onChange={(e) => {
                        setBiografia(e.target.value);
                      }}
                      error={!!biografiaError}
                      helperText={biografiaError}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider variant="middle" />
          </Box>
        </div>
      </Grid>

      <Grid container direction="column" alignItems="center">
        <div className={classes.section}>
          <Box border={1} borderRadius={16}>
            <div className={classes.sectionHeader}>
              <Typography variant="h5">Información multimedia</Typography>
            </div>
            {/* Avatar Input */}
            <ListItem button onClick={() => setOpenAvatarDropzone(true)} className={classes.input}>
              <div className={classes.inputFlex}>
                <div className={classes.inputContent}>
                  <div className={classes.inputLabelContainer}>
                    <Typography className={classes.inputLabel} color="textSecondary">
                      Avatar
                    </Typography>
                  </div>
                  <div className={classes.inputField}>
                    <Typography color="textSecondary">Puedes personalizar tu cuenta con un avatar</Typography>
                  </div>
                </div>
              </div>
              <div className={[classes.inputAvatarContainer, classes.inputEndItemContainer].join(" ")}>
                <Avatar className={classes.inputAvatar} src={avatarSrc} alt={username} />
                <div className={classes.sombraAvatar}>
                  <CameraAlt fontSize="small" className={classes.iconaSombra} />
                </div>
              </div>
            </ListItem>
            <DropzoneDialog
              open={openAvatarDropzone}
              onSave={(files) => handleSaveAvatar(files)}
              onClose={() => setOpenAvatarDropzone(false)}
              acceptedFiles={["image/*"]}
              filesLimit={1}
              showAlerts={false}
              maxFileSize={2000000}
              onAlert={(message, variant) => enqueueSnackbar(message, { variant })}
              dropzoneText="Arrastra y suelta una foto aquí o haga clic"
              showFileNamesInPreview={false}
              cancelButtonText="Cancelar"
              submitButtonText="Elejir como avatar"
              dialogTitle={<Typography className={classes.dropzoneTitle}>Selecciona un avatar para tu perfil</Typography>}
              dialogProps={{ className: classes.dropzone }}
            />
            {/* End Avatar Input */}
            <Divider variant="middle" />
            {/* Banner Input */}
            <ListItem button onClick={() => setOpenBannerDropzone(true)} className={classes.input}>
              <div className={classes.inputFlex}>
                <div className={classes.inputContent}>
                  <div className={classes.inputLabelContainer}>
                    <Typography className={classes.inputLabel} color="textSecondary">
                      Banner
                    </Typography>
                  </div>
                  <div className={classes.inputField}>
                    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                      <img className={classes.banner} src={bannerSrc} alt="Banner" />
                      <CameraAlt fontSize="large" className={classes.iconaBanner} />
                    </div>
                  </div>
                </div>
              </div>
            </ListItem>
            <DropzoneDialog
              open={openBannerDropzone}
              onSave={(files) => handleSaveBanner(files)}
              onClose={() => setOpenBannerDropzone(false)}
              acceptedFiles={["image/*"]}
              filesLimit={1}
              showAlerts={false}
              maxFileSize={2000000}
              onAlert={(message, variant) => enqueueSnackbar(message, { variant })}
              dropzoneText="Arrastra y suelta una foto aquí o haga clic"
              showFileNamesInPreview={false}
              cancelButtonText="Cancelar"
              submitButtonText="Elejir como banner"
              dialogTitle={<Typography className={classes.dropzoneTitle}>Selecciona un banner para tu perfil</Typography>}
              dialogProps={{ className: classes.dropzone }}
            />
            {/* End Banner Input */}
          </Box>
        </div>
      </Grid>

      <Grid container direction="column" alignItems="center">
        <div className={classes.section}>
          <Box className={classes.redBox} border={1} borderRadius={16}>
            <div className={classes.sectionHeader}>
              <Typography variant="h5">Eliminar cuenta de usuario</Typography>
              <Typography color="textSecondary">¡Advertencia! Esto eliminará permanentemente todos los datos de tu cuenta.</Typography>
            </div>
            <div className={classes.input}>
              <Button className={classes.redButton} onClick={() => setOpenModal(true)}>
                Eliminar cuenta
              </Button>
            </div>
          </Box>
        </div>
      </Grid>

      {/* Delete Account Modal */}
      <Modal
        className={classes.modal}
        open={openModal}
        onClose={onCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.deleteAccountModal}>
            <Card>
              <CardHeader
                action={
                  <IconButton aria-label="close" onClick={onCloseModal}>
                    <Close />
                  </IconButton>
                }
                title="¿Estás absolutamente seguro?"
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta {usuario.username}, tu información sobre los mangas, comentarios y toda la información de tu cuenta.
                </Typography>
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                  Escriba su nombre de usuario y contraseña para confirmar.
                </Typography>
              </CardContent>
              <CardActions disableSpacing style={{ display: "flex", flexDirection: "column" }}>
                <div className={classes.modalInputs}>
                  <TextField
                    type="text"
                    value={usernameDeleteConfirmation}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Nombre de usuario"
                    onChange={(e) => {
                      setUsernameDeleteConfirmation(e.target.value);
                    }}
                  />
                  <TextField
                    type="password"
                    value={passwordDeleteConfirmation}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Contraseña"
                    onChange={(e) => {
                      setPasswordDeleteConfirmation(e.target.value);
                    }}
                    error={!!passwordDeleteConfirmationError}
                    helperText={passwordDeleteConfirmationError}
                  />
                </div>
                <Button disabled={usuario.username !== usernameDeleteConfirmation} onClick={deleteAccount} className={classes.redButton} fullWidth>
                  Entiendo las consecuencias, eliminar esta cuenta
                </Button>
              </CardActions>
            </Card>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default Settings;
