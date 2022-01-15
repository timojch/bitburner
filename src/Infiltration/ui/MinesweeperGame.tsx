import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { interpolate } from "./Difficulty";
import { getArrow } from "../utils";
import Typography from "@mui/material/Typography";

interface Difficulty {
  [key: string]: number;
  timer: number;
  size: number;
  mines: number;
  clusterSize: number;
}

const difficulties: {
  Trivial: Difficulty;
  Easy: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 15000, size: 3 * 3, mines: 4, clusterSize: 4 },
  Easy: { timer: 15000, size: 4 * 4, mines: 8, clusterSize: 4 },
  Normal: { timer: 15000, size: 5 * 5, mines: 12, clusterSize: 4 },
  Hard: { timer: 15000, size: 6 * 6, mines: 15, clusterSize: 5 },
  Impossible: { timer: 15000, size: 7 * 7, mines: 18, clusterSize: 5 }
};

export function MinesweeperGame(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { timer: 0, size: 0, mines: 0, clusterSize: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [transpose] = useState(() => Math.random() > 0.5);
  const [minefield] = useState(() => generateMinefield(difficulty, transpose));
  const [answer, setAnswer] = useState(() => generateEmptyField(difficulty, transpose));
  const [pos, setPos] = useState([0, 0]);
  const [memoryPhase, setMemoryPhase] = useState(true);

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    if (memoryPhase) return;
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
    next[0] = (next[0] + minefield[0].length) % minefield[0].length;
    next[1] = (next[1] + minefield.length) % minefield.length;
    setPos(next);

    if (event.key == " ") {
      if (!minefield[pos[1]][pos[0]]) {
        props.onFailure();
        return;
      }
      setAnswer((old) => {
        old[pos[1]][pos[0]] = true;
        if (fieldEquals(minefield, old)) props.onSuccess();
        return old;
      });
    }
  }

  useEffect(() => {
    const id = setTimeout(() => setMemoryPhase(false), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <Grid container spacing={3}>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Grid item xs={12}>
        <Typography variant="h4">{memoryPhase ? "Remember all the mines!" : "Mark all the mines!"}</Typography>
        {minefield.map((line, y) => (
          <div key={y}>
            <Typography>
              {line.map((cell, x) => {
                if (memoryPhase) {
                  if (minefield[y][x]) return <span key={x}>[?]&nbsp;</span>;
                  return <span key={x}>[&nbsp;]&nbsp;</span>;
                } else {
                  if (x == pos[0] && y == pos[1]) return <span key={x}>[X]&nbsp;</span>;
                  if (answer[y][x]) return <span key={x}>[.]&nbsp;</span>;
                  return <span key={x}>[&nbsp;]&nbsp;</span>;
                }
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

function fieldEquals(a: boolean[][], b: boolean[][]): boolean {
  function count(field: boolean[][]): number {
    return field.flat().reduce((a, b) => a + (b ? 1 : 0), 0);
  }
  return count(a) === count(b);
}

function generateEmptyField(difficulty: Difficulty, transpose: boolean): boolean[][] {
  const field = [];
  let width = 1; let height = 1;
  while (width * height < difficulty.size) {
    if (width <= height) {
      width++;
    }
    else {
      height++;
    }
  }

  console.log(`Generating a ${width}x${height} field`)

  if (transpose) {
    // swap width and height so some fields are long and others are wide
    [width, height] = [height, width];
  }

  for (let i = 0; i < height; i++) {
    field.push(new Array(width).fill(false));
  }
  return field;
}

function generateMinefield(difficulty: Difficulty, transpose: boolean): boolean[][] {
  const field = generateEmptyField(difficulty, transpose);
  let minesToPlace = Math.floor(difficulty.mines + Math.random());
  while (minesToPlace > 0) {
    const clusterSize = Math.min(minesToPlace, Math.ceil(Math.random() * difficulty.clusterSize));
    placeClusterInField(field, clusterSize);
    minesToPlace -= clusterSize;
  }
  return field;
}

function placeClusterInField(field: boolean[][], clusterSize: number) {
  let row = Math.floor(Math.random() * field.length);
  let col = Math.floor(Math.random() * field[0].length);
  let minesToPlace = clusterSize;

  while (minesToPlace > 0) {
    if (!field[row][col]) {
      console.log(`Added mine at ${row},${col}`)
      field[row][col] = true;
      minesToPlace--;
    }

    const direction = Math.random() * Math.PI * 2;
    row += Math.round(Math.sin(direction))
    col += Math.round(Math.cos(direction))
    row = maxMin(row, 0, field.length - 1);
    col = maxMin(col, 0, field[0].length - 1);
  }
}

function maxMin(input: number, min: number, max: number): number {
  return Math.min(Math.max(input, min), max);
}
