import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControl,
  FormControlLabel,
  InputLabel,
  Fab,
  Grid,
  Box,
} from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import kebabCase from "lodash/kebabCase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      height: "100vh",
    },
    paper: {
      width: 500,
      height: 200,
      padding: theme.spacing(2),
    },
    playerSelect: {
      width: "60%",
    },
  })
);

export default function LobbyPage() {
  const classes = useStyles();
  const { roomId } = useParams();
  const history = useHistory();
  const [isMayor, setIsMayor] = useState(false);
  const [roomName, setRoomName] = useState(roomId ?? "");
  const [player, setPlayer] = useState("Alan");

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };
  const handleSelectPlayer = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPlayer(event.target.value as string);
  };
  const handleSetIsMayor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMayor(event.target.checked);
  };

  const handleGoToRoom = () => {
    history.push(
      `${kebabCase(roomName)}/${isMayor ? "mayor" : "player"}/${player}`
    );
  };
  return (
    <Container>
      <Grid
        className={classes.grid}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Paper elevation={3} className={classes.paper}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
          >
            <TextField
              id="roomName"
              label="Room Name"
              value={roomName}
              onChange={handleRoomNameChange}
            />
            <Box display="flex" justifyContent="space-between">
              <FormControl variant="outlined" className={classes.playerSelect}>
                <InputLabel id="player-select-label">Player</InputLabel>
                <Select
                  labelId="player-select-label"
                  value={player}
                  onChange={handleSelectPlayer}
                  label="Player"
                >
                  <MenuItem value={"Alan"}>Alan</MenuItem>
                  <MenuItem value={"Austin"}>Austin</MenuItem>
                  <MenuItem value={"Beth"}>Beth</MenuItem>
                  <MenuItem value={"Cheryl"}>Cheryl</MenuItem>
                  <MenuItem value={"Claire"}>Claire</MenuItem>
                  <MenuItem value={"Garrett"}>Garrett</MenuItem>
                  <MenuItem value={"Kevin"}>Kevin</MenuItem>
                  <MenuItem value={"Rachel"}>Rachel</MenuItem>
                  <MenuItem value={"Scott"}>Scott</MenuItem>
                  <MenuItem value={"Sue"}>Sue</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMayor}
                    onChange={handleSetIsMayor}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={"Mayor"}
              />
            </Box>
            <Fab
              disabled={!player || !roomName}
              variant="extended"
              onClick={handleGoToRoom}
            >
              <NavigationIcon />
              Go to Room
            </Fab>
          </Box>
        </Paper>
      </Grid>
    </Container>
  );
}
