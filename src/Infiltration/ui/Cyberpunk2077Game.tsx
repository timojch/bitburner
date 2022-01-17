import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { interpolate } from "./Difficulty";
import { getArrow } from "../utils";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";


interface Difficulty {
  [key: string]: number;
  timer: number;
  size: number;
  sequenceLength: number;
}

const difficulties: {
  Trivial: Difficulty;
  Easy: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 17000, size: 2 * 3, sequenceLength: 4 },
  Easy: { timer: 16000, size: 3 * 3, sequenceLength: 4 },
  Normal: { timer: 15000, size: 3 * 4, sequenceLength: 5 },
  Hard: { timer: 12000, size: 4 * 4, sequenceLength: 5 },
  Impossible: { timer: 10000, size: 5 * 5, sequenceLength: 8 },
};

export function Cyberpunk2077Game(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { timer: 0, size: 0, sequenceLength: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [grid] = useState(generatePuzzle(difficulty));
  const [answer] = useState(generateAnswer(grid, difficulty));
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState([0, 0]);

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    const move = [0, 0];
    for (let arrow of getArrow(event)) {
      switch (arrow) {
        case "↑":
          move[1]--;
          break;
        case "←":
          move[0]--;
          break;
        case "↓":
          move[1]++;
          break;
        case "→":
          move[0]++;
          break;
      }
    }
    const next = [pos[0] + move[0], pos[1] + move[1]];
    next[0] = (next[0] + grid[0].length) % grid[0].length;
    next[1] = (next[1] + grid.length) % grid.length;
    setPos(next);

    if (event.key === " ") {
      const selected = grid[pos[1]][pos[0]];
      const expected = answer[index];
      if (selected !== expected) {
        props.onFailure();
        return;
      }
      setIndex(index + 1);
      if (answer.length === index + 1) props.onSuccess();
    }
  }

  const selectedItemColor = "lightblue"
  const fontSize = "2em";
  return (
    <Grid container spacing={3}>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Grid item xs={12}>
        <Typography variant="h4">Match the symbols!</Typography>
        <Typography variant="h5" color="primary" >
          Targets:{" "}
          {answer.map((a, i) => {
            if (i == index)
              return (
                <span key={`${i}`} style={{ fontSize: "1em", color: selectedItemColor }}>
                  {a}&nbsp;
                </span>
              );
            return (
              <span key={`${i}`} style={{ fontSize: "1em" }}>
                {a}&nbsp;
              </span>
            );
          })}
        </Typography>
        <br />
        {grid.map((line, y) => (
          <div key={y}>
            <Typography>
              {line.map((cell, x) => {
                if (x == pos[0] && y == pos[1])
                  return (
                    <span key={`${x}${y}`} style={{ fontSize: fontSize, color: selectedItemColor }}>
                      {cell}&nbsp;
                    </span>
                  );
                return (
                  <span key={`${x}${y}`} style={{ fontSize: fontSize}}>
                    {cell}&nbsp;
                  </span>
                );
              })}
            </Typography>
            <br />
          </div>
        ))}
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Grid>
    </Grid>
  );
}

function generateAnswer(grid: string[][], difficulty: Difficulty): string[] {
  const answer = [];
  for (let i = 0; i < Math.round(difficulty.sequenceLength); i++) {
    answer.push(grid[Math.floor(Math.random() * grid.length)][Math.floor(Math.random() * grid[0].length)]);
  }
  return answer;
}

function randChar(): string {
  return "ABCDEF0123456789"[Math.floor(Math.random() * 16)];
}

function generatePuzzle(difficulty: Difficulty): string[][] {
  const puzzle = [];
  let width = 1; let height = 1;
  while (width * height < difficulty.size) {
    if (width <= height) {
      width++;
    }
    else {
      height++;
    }
  }

  if (Math.random() > 0.5) {
    // swap width and height
    [width, height] = [height, width];
  }

  for (let i = 0; i < Math.round(height); i++) {
    const line = [];
    for (let j = 0; j < Math.round(width); j++) {
      line.push(randChar() + randChar());
    }
    puzzle.push(line);
  }
  return puzzle;
}
