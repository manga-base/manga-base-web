import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, AppBar, Button, Dialog, Divider, GridList, GridListTile, GridListTileBar, IconButton, Slide, Toolbar, Typography } from "@material-ui/core";
import { Close, ExpandMore, Fullscreen } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import React, { forwardRef } from "react";
import { useState } from "react";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Message = ({ id, nombre, email, mensaje, created_at, fotos }) => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { enqueueSnackbar } = useSnackbar();

  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [read, setRead] = useState(false);

  const handleClickOpenFoto = (foto) => {
    setFotoSelecionada(foto);
  };

  const handleCloseFoto = () => {
    setFotoSelecionada(null);
  };

  const handleRead = async () => {
    try {
      const { data } = await http.put(`/private-contacto/${id}`);
      if (data.correcta) {
        setRead(true);
      }
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
        autoHideDuration: 2000,
      });
    } catch (error) {
      enqueueSnackbar("Error al cargar los mensajes", {
        variant: "error",
      });
    }
  };

  if (read) return null;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1c-content" id="panel1c-header">
        <div className={classes.column}>
          <Typography className={classes.heading}>{nombre}</Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>{email}</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <div className={classes.textDiv}>
          <div className={classes.doubleColumn}>
            <Typography variant="body1">{mensaje}</Typography>
          </div>
          <div className={[classes.column, classes.helper].join(" ")}>
            <Typography variant="h6" color="primary">
              #{id}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {created_at}
            </Typography>
          </div>
        </div>
        <div className={classes.fotosContainer}>
          <GridList cols={3}>
            {fotos && fotos.map((foto) => (
              <GridListTile key={foto.id}>
                <img src={`${imgUrl}contacto/${foto.foto}`} alt={foto.foto} />
                <GridListTileBar
                  actionIcon={
                    <IconButton value={foto.id} onClick={() => handleClickOpenFoto(foto)}>
                      <Fullscreen />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button color="secondary" size="small" onClick={handleRead}>
          Marcar como leído
        </Button>
      </AccordionActions>
      {/* Dialog */}
      <Dialog fullScreen open={fotoSelecionada !== null} onClose={handleCloseFoto} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleCloseFoto} aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {fotoSelecionada && fotoSelecionada.foto}
            </Typography>
          </Toolbar>
        </AppBar>
        {fotoSelecionada && <img className={classes.bigImage} src={`${imgUrl}contacto/${fotoSelecionada.foto}`} alt={fotoSelecionada.foto} />}
      </Dialog>
      {/* End Dialog */}
    </Accordion>
  );
};

export default Message;
