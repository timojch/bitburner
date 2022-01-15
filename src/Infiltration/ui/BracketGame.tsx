import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { random } from "../utils";
import { interpolate } from "./Difficulty";
import { BlinkingCursor } from "./BlinkingCursor";
import Typography from "@mui/material/Typography";

interface Difficulty {
  [key: string]: number;
  timer: number;
  numRuns: number;
  maxRunLength: number;
}

const difficulties: {
  Trivial: Difficulty;
  Easy: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 8000, numRuns: 4, maxRunLength: 2 },
  Easy: { timer: 7000, numRuns: 5, maxRunLength: 2 },
  Normal: { timer: 6000, numRuns: 6, maxRunLength: 3 },
  Hard: { timer: 5000, numRuns: 7, maxRunLength: 3 },
  Impossible: { timer: 4000, numRuns: 9, maxRunLength: 4 },
};

function generateLeftSide(difficulty: Difficulty): string {
  let str = "";
  for (let i = 0; i < difficulty.numRuns; i++) {
    const runLength = Math.ceil(Math.pow(Math.random(), 2.6) * difficulty.maxRunLength);
    str += (["[", "<", "(", "{"][Math.floor(Math.random() * 4)]).repeat(runLength);
  }

  return str;
}

function getChar(event: KeyboardEvent): string {
  if (event.key === ")") return ")";
  if (event.key === "]") return "]";
  if (event.key === "}") return "}";
  if (event.key === ">") return ">";
  return "";
}

function match(left: string, right: string): boolean {
  return (
    (left === "[" && right === "]") ||
    (left === "<" && right === ">") ||
    (left === "(" && right === ")") ||
    (left === "{" && right === "}")
  );
}

export function BracketGame(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { timer: 0, numRuns: 0, maxRunLength: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [right, setRight] = useState("");
  const [left] = useState(generateLeftSide(difficulty));

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    const char = getChar(event);
    if (!char) return;
    if (!match(left[left.length - right.length - 1], char)) {
      props.onFailure();
      return;
    }
    if (left.length === right.length + 1) {
      props.onSuccess();
      return;
    }
    setRight(right + char);
  }

  return (
    <Grid container spacing={3}>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Grid item xs={12}>
        <Typography variant="h4">Close the brackets</Typography>
        <Typography style={{ fontSize: "5em" }}>
          {`${left}${right}`}
          <BlinkingCursor />
        </Typography>
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Grid>
    </Grid>
  );
}
