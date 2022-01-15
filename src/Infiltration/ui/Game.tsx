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
import { IMinigameInfo } from "../IMinigameInfo";
import { minigames } from "../data/minigames"
import { Infiltration, IChallenge, ChallengeReward, ChallengeDifficulty, InfiltrationOutcome } from "../infiltration"
import { IInfiltrationTarget } from "../IInfiltrationTarget"
import { AlarmLevel } from "./AlarmLevel"
import { Intel } from "./Intel"

interface IProps {
  Target: IInfiltrationTarget;
}

enum Stage {
  Countdown = 0,
  Minigame,
  Interlude,
  Result,
  Sell,
}

const minigameDelegates = [
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
  const [stage, setStage] = useState(Stage.Interlude);
  const [results, setResults] = useState("");
  const [metagame, setMetagame] = useState(new Infiltration(props.Target, player));
  const [currentChallenge, setCurrentChallenge] = useState({
    MinigameDefinition: minigames[0],
    Difficulty: new ChallengeDifficulty(),
    Reward: new ChallengeReward(),
    IsComplete: false,
  })

  function pushResult(win: boolean): void {
    setResults((old) => {
      let next = old;
      next += win ? "✓" : "✗";
      if (next.length > 15) next = next.slice(1);
      return next;
    });
  }

  function success(): void {
    if(currentChallenge.IsComplete)
      return;
      
    pushResult(true);
    metagame.OnSuccess(currentChallenge);

    if (metagame.Outcome == InfiltrationOutcome.Successful) {
      setStage(Stage.Sell);
    }
    else {
      setStage(Stage.Interlude);
    }
  }

  function failure(options?: { automated: boolean }): void {
    if(currentChallenge.IsComplete)
      return;

    pushResult(false);
    metagame.OnFailure(currentChallenge);

    // Kill the player immediately if they use automation, so
    // it's clear they're not meant to
    if (options?.automated) {
      player.takeDamage(player.hp)
      router.toCity();
      return;
    }

    if (metagame.Outcome == InfiltrationOutcome.Failed) {
      router.toCity();
      return;
    }
    else {
      setStage(Stage.Interlude);
    }
  }

  function cancel(): void {
    router.toCity();
    return;
  }

  function finishInfiltration(): void {
    if(metagame.Intel > 1) {
      setStage(Stage.Sell);
    }
    else {
      router.toCity();
      return;
    }
  }

  function selectNextGame(nextGame: IChallenge) {
    setCurrentChallenge(nextGame);
    setStage(Stage.Countdown);
  }


  let stageComponent: React.ReactNode;
  switch (stage) {
    case Stage.Countdown:
      stageComponent = <Countdown onFinish={() => setStage(Stage.Minigame)} />;
      break;
    case Stage.Minigame: {
      console.log(`Starting minigame ${currentChallenge.MinigameDefinition.Index} with difficulty ${currentChallenge.Difficulty.Difficulty}`)
      const MiniGame = minigameDelegates[currentChallenge.MinigameDefinition.Index];
      stageComponent = <MiniGame
        onSuccess={success}
        onFailure={failure}
        difficulty={currentChallenge.Difficulty.Difficulty} />;
      break;
    }
    case Stage.Interlude:
      const options = metagame.CreateChallengeOptions(3);
      stageComponent = (
        <Interlude
          onRetreat={finishInfiltration}
          onSelect={selectNextGame}
          options={options}
          metagame={metagame}
        />
      );
      break;
    case Stage.Sell:
      stageComponent = (
        <Victory
          Metagame={metagame}
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
            Access: {metagame.AccessLevel}&nbsp;/&nbsp;{metagame.Target.maxClearanceLevel}
          </Typography>
          <Progress />
        </Grid>
        <Grid item xs={3}>
          <AlarmLevel alarmLevel={metagame.AlarmLevel} maximumAlarmLevel={metagame.Target.maxAlarmLevelForEscape}/>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            Intel: <Intel intel={metagame.Intel}/>
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {stageComponent}
        </Grid>
      </Grid>
    </>
  );
}
