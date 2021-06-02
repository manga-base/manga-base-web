import { AppBar, Toolbar, makeStyles, Button, IconButton, Drawer, Link, MenuItem, Avatar, Menu, Divider, ListItemIcon, ListItem, List, ListItemText } from "@material-ui/core";
import { AccountBox, CollectionsBookmark, ExitToApp, Home, Notifications, Search, Settings } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

import logo from "./logo.svg";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const useStyles = makeStyles((theme) => ({
  header: {
    paddingRight: "79px",
    paddingLeft: "118px",
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
  },
  menuButton: {
    fontWeight: 600,
    size: "18px",
    margin: "0 7px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerContainer: {
    padding: "15px 30px 0",
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  drawerChoice: {
    display: "flex",
    alignItems: "center",
    marginTop: "7px",
  },
  divider: {
    marginTop: "20px",
  },
  avatarMobileContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  largeAvatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  username: {
    fontWeight: 600,
    size: "18px",
  },
  logoutButton: {
    marginBottom: "10px",
  },
  menu: {
    marginTop: "8px",
  },
}));

export default function Header() {
  let location = useLocation();
  const classes = useStyles();
  const { usuario, logout } = useUser();
  const [mobileView, setMobileView] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarSrc = usuario && usuario.avatar && imgUrl + "avatars/" + usuario.avatar;
  const id = usuario && usuario.id;

  const headersData = [
    {
      label: "Home",
      href: "/",
      icon: <Home />,
      publicUser: true,
    },
    {
      label: "Biblioteca",
      href: "/biblioteca",
      icon: <Search />,
      publicUser: true,
    },
    {
      label: "Perfil",
      href: "/profile/" + id,
      icon: <AccountBox />,
      publicUser: false,
    },
    {
      label: "Mis Mangas",
      href: "/mis-mangas",
      icon: <CollectionsBookmark />,
      publicUser: false,
    },
  ];

  const menuLinks = [
    {
      label: "Perfil",
      href: "/profile/" + id,
      icon: <AccountBox />,
    },
    {
      label: "Mis Mangas",
      href: "/mis-mangas",
      icon: <CollectionsBookmark />,
    },
    {
      label: "Ajustes",
      href: "/settings",
      icon: <Settings />,
    },
  ];

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900 ? setMobileView(true) : setMobileView(false);
    };
    setResponsiveness();
    window.addEventListener("resize", setResponsiveness);
  }, []);

  const displayDesktop = () => {
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const MenuLinks = () =>
      menuLinks.map(({ label, href, icon }) => (
        <Link
          {...{
            key: label,
            component: RouterLink,
            to: href,
            color: "inherit",
            style: { textDecoration: "none" },
          }}
        >
          <MenuItem>
            {icon}
            {label}
          </MenuItem>
        </Link>
      ));

    const getAvatarDesktop = () => {
      return (
        <>
          <IconButton color="inherit" aria-label="Notificaciones" aria-controls="notifications-menu" aria-haspopup="true" component="span">
            <Notifications />
          </IconButton>
          <IconButton aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} component="span">
            <Avatar src={avatarSrc} alt={usuario.username} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            className={classes.menu}
          >
            <div>
              <MenuLinks />
            </div>
            <Link
              {...{
                onClick: logout,
                color: "inherit",
                style: { textDecoration: "none" },
              }}
            >
              <MenuItem>
                <ExitToApp color="error" />
                Salir
              </MenuItem>
            </Link>
          </Menu>
        </>
      );
    };

    const getMenuButtons = () => {
      return headersData.map(({ label, href, icon, publicUser }) => {
        if (!publicUser && !usuario) return null;
        return (
          <Button
            {...{
              key: label,
              color: location.pathname === href ? "primary" : "inherit",
              to: href,
              component: RouterLink,
              className: classes.menuButton,
              startIcon: icon,
            }}
          >
            {label}
          </Button>
        );
      });
    };

    const getLoginButtons = () => {
      return (
        <>
          <Button
            {...{
              color: "inherit",
              variant: "text",
              to: "/login",
              component: RouterLink,
              className: classes.menuButton,
            }}
          >
            Inicia Sesión
          </Button>
          <Button
            {...{
              color: "secondary",
              variant: "contained",
              to: "/signup",
              component: RouterLink,
              className: classes.menuButton,
            }}
          >
            Registrate
          </Button>
        </>
      );
    };

    return (
      <Toolbar className={classes.toolbar}>
        {getLogo}
        <div>{getMenuButtons()}</div>
        <div>{usuario ? getAvatarDesktop() : getLoginButtons()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerClose = () => {
      setDrawerOpen(false);
    };

    const getAvatarMobile = () => {
      return (
        <div className={classes.avatarMobileContainer}>
          <IconButton aria-controls="menu-appbar" aria-haspopup="true" onClick={handleDrawerClose} component={RouterLink} to="/perfil" color="inherit">
            <Avatar src={avatarSrc} alt={usuario.username} className={classes.largeAvatar} />
          </IconButton>
          <span className={classes.username}>{usuario.username}</span>
        </div>
      );
    };

    const getDrawerChoices = () => {
      return (
        <List>
          {headersData
            .filter(({ publicUser }) => publicUser || (!publicUser && usuario))
            .map(({ label, href, icon }) => (
              <ListItem
                button
                selected={location.pathname.includes(href)}
                {...{
                  component: RouterLink,
                  to: href,
                  key: label,
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText color="" primary={label} />
              </ListItem>
            ))}
        </List>
      );
    };

    const getLoginMobile = () => {
      return (
        <>
          <Button
            {...{
              color: mobileView ? "secondary" : "inherit",
              variant: mobileView ? "outlined" : "text",
              to: "/login",
              component: RouterLink,
              className: classes.menuButton,
              onClick: handleDrawerClose,
            }}
          >
            Inicia Sesión
          </Button>
          <Button
            {...{
              color: "secondary",
              variant: "contained",
              to: "/signup",
              component: RouterLink,
              className: classes.menuButton,
              onClick: handleDrawerClose,
            }}
          >
            Registrate
          </Button>
        </>
      );
    };

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: () => {
              setDrawerOpen(true);
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={classes.drawerContainer}>
            <div>
              {usuario ? getAvatarMobile() : getLoginMobile()}
              <Divider className={classes.divider} />
              <div onClick={handleDrawerClose}>{getDrawerChoices()}</div>
            </div>
            {usuario && (
              <Button
                onClick={() => {
                  logout();
                  handleDrawerClose();
                }}
                variant="text"
                className={classes.logoutButton}
                startIcon={<ExitToApp color="error" />}
              >
                Salir
              </Button>
            )}
          </div>
        </Drawer>

        <div>{getLogo}</div>
      </Toolbar>
    );
  };

  const getLogo = (
    <IconButton component={RouterLink} to="/" >
      <img src={logo} alt="Logo" style={{ height: 40 }} />
    </IconButton>
  );

  return (
    <AppBar color="inherit" className={classes.header}>
      {mobileView ? displayMobile() : displayDesktop()}
    </AppBar>
  );
}
