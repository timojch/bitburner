import React from "react";
import { Location } from "../../Locations/Location";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { numeralWrapper } from "../../ui/numeralFormat";

interface IProps {
  Location: Location;
  Difficulty: number;
  MaxLevel: number;
  start: () => void;
  cancel: () => void;
}

function arrowPart(color: string, length: number): JSX.Element {
  let arrow = "";
  if (length <= 0) length = 0;
  else if (length > 13) length = 13;
  else {
    length--;
    arrow = ">";
  }
  return (
    <span style={{ color: color }}>
      {"=".repeat(length)}
      {arrow}
      {" ".repeat(13 - arrow.length - length)}
    </span>
  );
}

function coloredArrow(difficulty: number): JSX.Element {
  if (difficulty === 0) {
    return (
      <span style={{ color: "white" }}>
        {">"}
        {" ".repeat(38)}
      </span>
    );
  } else {
    return (
      <>
        {arrowPart("white", difficulty * 13)}
        {arrowPart("orange", (difficulty - 1) * 13)}
        {arrowPart("red", (difficulty - 2) * 13)}
      </>
    );
  }
}

export function Intro(props: IProps): React.ReactElement {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Typography variant="h4">Infiltrating {props.Location.name}</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="h5" color="primary">
            Maximum level: {props.MaxLevel}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="h5" color="primary">
            Difficulty: {numeralWrapper.format(props.Difficulty * 33.3333, "0")} / 100
          </Typography>
        </Grid>

        {props.Difficulty > 1.5 && (
          <Grid item xs={10}>
            <Typography variant="h5" color="primary">
              Warning: This location is too heavily guarded for your current stats, try training or finding an easier
              location.
            </Typography>
          </Grid>
        )}

        <Grid item xs={10}>
          <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>[{coloredArrow(props.Difficulty)}]</Typography>
          <Typography
            sx={{ lineHeight: "1em", whiteSpace: "pre" }}
          >{` ^            ^            ^           ^`}</Typography>
          <Typography
            sx={{ lineHeight: "1em", whiteSpace: "pre" }}
          >{` Trivial    Normal        Hard    Impossible`}</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>
            Infiltration is a series of short minigames during which you accumulate Intel, which you can
            trade for faction reputation or money after a successful escape.
          </Typography>
          <br />
          <Typography>
            At each stage, you will be given a choice of three different challenges, each with different
            rewards and possibly different difficulties.
          </Typography>
          <br />
          <Typography>
            Completing a challenge also increases the Alarm Level, which increases the difficulty of all
            games. At low Alarm Level, you can end the infiltration between games and collect your rewards.
            However, if the Alarm you will have to complete an Escape challenge in order to collect your rewards.
          </Typography>
          <br />
          <Typography>No game require use of the mouse.</Typography>
          <br />
          <Typography>Spacebar is the default action/confirm button.</Typography>
          <br />
          <Typography>Everything that uses arrow can also use WASD</Typography>
          <br />
          <Typography>Sometimes the rest of the keyboard is used.</Typography>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={props.start}>Start</Button>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={props.cancel}>Cancel</Button>
        </Grid>
      </Grid>
    </>
  );
}
