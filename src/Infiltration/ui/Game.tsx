import { use } from "../../ui/Context";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Countdown } from "./Countdown";
import { Interlude } from "./Interlude";
import { BracketGame } from "./BracketGame";
import { SlashGame } from "./SlashGame";
import { BackwardGame } from "./BackwardGame";
import { BribeGame } from "./BribeGame";
import { CheatCodeGame } from "./CheatCodeGame";
import { Cyberpunk2077Game } from "./Cyberpunk2077Game";
import { MinesweeperGame } from "./MinesweeperGame";
import { WireCuttingGame } from "./WireCuttingGame";
import { Victory } from "./Victory";
import Typography from "@mui/material/Typography";
import { IMinigameInfo, IMinigameInstanceInfo } from "./IMinigameInfo";

interface IProps {
  StartingDifficulty: number;
  Difficulty: number;
  Reward: number;
  MaxLevel: number;
}

enum Stage {
  Countdown = 0,
  Minigame,
  Interlude,
  Result,
  Sell,
}

const minigamesInfo: IMinigameInfo[] = [
  {
    ProgrammaticName: "SlashGame",
    FriendlyName: "Slash the Guard",
    Callback: SlashGame,
    Index: 0
  },
  {
    ProgrammaticName: "BracketGame",
    FriendlyName: "Close the Brackets",
    Callback: BracketGame,
    Index: 1
  },
  {
    ProgrammaticName: "BackwardGame",
    FriendlyName: "Type Reversed Text",
    Callback: BackwardGame,
    Index: 2
  },
  {
    ProgrammaticName: "BribeGame",
    FriendlyName: "Flatter the Guard",
    Callback: BribeGame,
    Index: 3
  },
  {
    ProgrammaticName: "CheatCodeGame",
    FriendlyName: "Enter the Code",
    Callback: CheatCodeGame,
    Index: 4
  },
  {
    ProgrammaticName: "Cyberpunk2077Game",
    FriendlyName: "Find the Symbols",
    Callback: Cyberpunk2077Game,
    Index: 5
  },
  {
    ProgrammaticName: "MinesweeperGame",
    FriendlyName: "Remember the Mines",
    Callback: MinesweeperGame,
    Index: 6
  },
  {
    ProgrammaticName: "WireCuttingGame",
    FriendlyName: "Cut the Wires",
    Callback: WireCuttingGame,
    Index: 7
  },
]

const minigames = [
  SlashGame,
  BracketGame,
  BackwardGame,
  BribeGame,
  CheatCodeGame,
  Cyberpunk2077Game,
  MinesweeperGame,
  WireCuttingGame,
];

export function Game(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const [level, setLevel] = useState(1);
  const [stage, setStage] = useState(Stage.Interlude);
  const [results, setResults] = useState("");
  const [gameIds, setGameIds] = useState({
    lastGames: [-1, -1],
    id: Math.floor(Math.random() * minigames.length),
    instanceInfo: {
      Info: minigamesInfo[0],
      Difficulty: 0,
      Reward: 1
    }
  });

  function getRandomGames(count: number): IMinigameInfo[] {
    let ret: IMinigameInfo[] = [];

    var chooseFrom = [...minigamesInfo];

    // Avoid repeating a game that's been selected recently
    chooseFrom = chooseFrom.filter(info => !gameIds.lastGames.includes(info.Index));

    while (ret.length < count && chooseFrom.length > 0) {
      let id: number = Math.floor(Math.random() * chooseFrom.length);
      ret.push(minigamesInfo[id]);
      chooseFrom.splice(id, 1);
    }

    return ret;
  }

  function InstantiateGame(game: IMinigameInfo): IMinigameInstanceInfo {
    const baseDifficulty = props.Difficulty + level / 50;
    const randomDifficulty = (Math.random() * 1.5) - 0.2
    const bonusReward = Math.random() > 0.8 ? 1 : 0;
    return {
      Info: game,
      Difficulty: baseDifficulty + randomDifficulty + bonusReward,
      Reward: 1 + bonusReward,
    }
  }

  function success(): void {
    pushResult(true);
    if (level === props.MaxLevel) {
      setStage(Stage.Sell);
    } else {
      setStage(Stage.Interlude);
      setLevel(level + gameIds.instanceInfo.Reward);
    }
  }

  function pushResult(win: boolean): void {
    setResults((old) => {
      let next = old;
      next += win ? "✓" : "✗";
      if (next.length > 15) next = next.slice(1);
      return next;
    });
  }

  function failure(options?: { automated: boolean }): void {
    setStage(Stage.Interlude);
    pushResult(false);
    // Kill the player immediately if they use automation, so
    // it's clear they're not meant to
    const damage = options?.automated ? player.hp : props.StartingDifficulty * 3;
    if (player.takeDamage(damage)) {
      router.toCity();
      return;
    }
  }

  function cancel(): void {
    router.toCity();
    return;
  }

  function selectNextGame(nextGame: IMinigameInstanceInfo) {
    let updatedLastGames = [...gameIds.lastGames];
    updatedLastGames.splice(0, 1);
    updatedLastGames.push(gameIds.id);
    setGameIds({
      lastGames: updatedLastGames,
      id: nextGame.Info.Index,
      instanceInfo: nextGame
    });

    setStage(Stage.Countdown);
  }

  let stageComponent: React.ReactNode;
  switch (stage) {
    case Stage.Countdown:
      stageComponent = <Countdown onFinish={() => setStage(Stage.Minigame)} />;
      break;
    case Stage.Minigame: {
      const MiniGame = minigames[gameIds.id];
      stageComponent = <MiniGame onSuccess={success} onFailure={failure} difficulty={gameIds.instanceInfo.Difficulty} />;
      break;
    }
    case Stage.Interlude:
      const options = getRandomGames(3).map(info => InstantiateGame(info));
      stageComponent = (
        <Interlude
          onRetreat={() => router.toCity()}
          onSelect={selectNextGame}
          options={options}
        />
      );
      break;
    case Stage.Sell:
      stageComponent = (
        <Victory
          StartingDifficulty={props.StartingDifficulty}
          Difficulty={props.Difficulty}
          Reward={props.Reward}
          MaxLevel={props.MaxLevel}
        />
      );
      break;
  }

  function Progress(): React.ReactElement {
    return (
      <Typography variant="h4">
        <span style={{ color: "gray" }}>{results.slice(0, results.length - 1)}</span>
        {results[results.length - 1]}
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button onClick={cancel}>Cancel</Button>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            Level: {level}&nbsp;/&nbsp;{props.MaxLevel}
          </Typography>
          <Progress />
        </Grid>

        <Grid item xs={12}>
          {stageComponent}
        </Grid>
      </Grid>
    </>
  );
}
