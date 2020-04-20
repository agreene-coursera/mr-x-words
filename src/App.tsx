import React from "react";
import {
  ThemeProvider,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LobbyPage from "./LobbyPage";
import MayorPage from "./MayorPage";
import PlayerPage from "./PlayerPage";

import theme from "./utils/theme";
import "./App.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "#333",
      color: "white",
    },
    title: {
      fontWeight: "bold",
    },
  })
);

function App() {
  const classes = useStyles();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Mr.X Words
              </Typography>
            </Toolbar>
          </AppBar>
          <Switch>
              <Route exact path={["/", "/:roomId"]}>
                <LobbyPage />
              </Route>
              <Route path="/mayor/:roomId/:name">
                <MayorPage />
              </Route>
              <Route path="/player/:roomId/:name">
                <PlayerPage />
              </Route>
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
