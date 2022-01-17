import { IPlayer } from "../PersonObjects/IPlayer";
import { IMinigameInfo } from "./IMinigameInfo"
import { minigames } from "./data/minigames"

import { calculateSkill, calculateExp } from "..//PersonObjects/formulas/skill";
import { IInfiltrationTarget } from "./IInfiltrationTarget"
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";

export interface IChallengeReward {
  IntelAmount: number,
  MoneyAmount: number,

  AccessAmount: number,
  ReduceAlarmLevelAmount: number,
  HealingAmount: number,

  HasEscape: boolean,
  DifficultyMod: number,

  HackExp: number,
  StrExp: number,
  DefExp: number,
  DexExp: number,
  AgiExp: number,
  ChaExp: number,
}

export interface IChallengeDifficulty {
  Difficulty: number,
}

export interface IChallenge {
  MinigameDefinition: IMinigameInfo,
  Difficulty: IChallengeDifficulty,
  Reward: IChallengeReward,
  IsComplete: boolean
}

export class ChallengeDifficulty implements IChallengeDifficulty {
  Difficulty: number = 0
}

export class ChallengeReward implements IChallengeReward {
  IntelAmount: number = 0;
  MoneyAmount: number = 0;

  AccessAmount: number = 0;
  ReduceAlarmLevelAmount: number = 0;
  HealingAmount: number = 0;

  HasEscape: boolean = false;
  DifficultyMod: number = 0;

  HackExp: number = 0;
  StrExp: number = 0;
  DefExp: number = 0;
  DexExp: number = 0;
  AgiExp: number = 0;
  ChaExp: number = 0;
}

export enum InfiltrationOutcome {
  Ongoing = 0,
  Successful,
  Failed
}

export class Infiltration {
  constructor(target: IInfiltrationTarget, player: IPlayer) {
    this.Target = target;
    this.Player = player;
  }

  Target: IInfiltrationTarget;
  Player: IPlayer;

  AlarmLevel: number = 0;
  AccessLevel: number = 0;
  Intel: number = 0;

  TimesAlarmsReduced: number = 0;

  Outcome: InfiltrationOutcome = InfiltrationOutcome.Ongoing

  LastGames: IMinigameInfo[] = []

  RecordGame(minigame: IMinigameInfo) {
    if (this.LastGames.length >= 3) {
      this.LastGames.splice(0, 1);
    }
    this.LastGames.push(minigame);
  }

  OnSuccess(challenge: IChallenge) {
    if (challenge.IsComplete) { return; }
    challenge.IsComplete = true;

    this.RecordGame(challenge.MinigameDefinition);
    this.ApplyReward(challenge.Reward);
    if (challenge.Reward.ReduceAlarmLevelAmount <= 0) {
      this.AlarmLevel += 1;
    }
    else {
      this.TimesAlarmsReduced++;
    }
  }

  OnFailure(challenge: IChallenge) {
    if (challenge.IsComplete) { return; }
    challenge.IsComplete = true;

    this.RecordGame(challenge.MinigameDefinition);
    const damage = Math.ceil(this.Target.startingSecurityLevel * (Math.random() + 1));
    if (this.Player.takeDamage(damage)) {
      this.Outcome = InfiltrationOutcome.Failed;
    }

    this.AlarmLevel += Math.floor(1 + this.AccessLevel / 5);
  }

  ApplyReward(reward: IChallengeReward): void {
    this.Intel += reward.IntelAmount;

    if (reward.MoneyAmount > 0) {
      this.Player.gainMoney(reward.MoneyAmount, "infiltration");
    }

    this.AccessLevel += reward.AccessAmount;
    this.AccessLevel = Math.min(this.AccessLevel, this.Target.maxClearanceLevel);

    this.AlarmLevel -= reward.ReduceAlarmLevelAmount;
    this.AlarmLevel = Math.max(this.AlarmLevel, 0);

    this.Player.hp += reward.HealingAmount;
    this.Player.hp = Math.min(this.Player.hp, this.Player.max_hp);

    this.Player.hacking_exp += reward.ChaExp;
    this.Player.strength_exp += reward.StrExp;
    this.Player.defense_exp += reward.DefExp;
    this.Player.dexterity_exp += reward.DexExp;
    this.Player.agility_exp += reward.AgiExp;
    this.Player.charisma_exp += reward.ChaExp;

    if (reward.HasEscape) {
      this.Outcome = InfiltrationOutcome.Successful;
    }
  }

  CreateChallengeOptions(count: number): IChallenge[] {
    let ret: IChallenge[] = [];

    let chooseFrom = [...minigames].filter(game => !this.LastGames.includes(game));

    let rewards = this.DrawChallengeRewards(count);

    if (rewards.length == 0) {
      console.warn(`Unable to generate any rewards.`);
      rewards.push(new ChallengeReward());
    }

    while (ret.length < count && chooseFrom.length > 0) {
      let id: number = Math.floor(Math.random() * chooseFrom.length);
      let randomGame = chooseFrom.splice(id, 1)[0];
      let difficultyAdded = (ret.length * 1 / 3) + rewards[ret.length].DifficultyMod;

      let randomReward = rewards[ret.length % rewards.length];

      let difficulty = this.CreateChallengeDifficulty(difficultyAdded);
      let difficultyBasedReward = new ChallengeReward();
      difficultyBasedReward.IntelAmount += (ret.length + 1) * (Math.random() * this.RewardModifier * 2.5);
      difficultyBasedReward = combineRewards(difficultyBasedReward, this.CreateChallengeExpReward(difficulty.Difficulty));
      ret.push({
        MinigameDefinition: randomGame,
        Difficulty: difficulty,
        Reward: combineRewards(randomReward, difficultyBasedReward),
        IsComplete: false
      });
    }

    return ret;
  }

  CreateChallengeDifficulty(difficultyMod: number): IChallengeDifficulty {
    return {
      Difficulty: this.BaseDifficulty + (this.AlarmLevel / 10) + difficultyMod
    };
  }

  CreateChallengeExpReward(difficulty: number) {

    // Long comment block explaining my thought process for how the base EXP formulas are derived.
    //
    // The bottom line idea is that an challenge success should grant EXP that's relevant
    //   at the level where you can do those infiltrations. I'm ballparking it at 8% of a level
    //   for an easy challenge.
    //   The rest is just math to figure out what level the player's skills should be and 
    // 
    // Calculate what stats the player would need for this to be an easy infiltration.
    // Start with this equation, then solve for stats.
    //   difficulty = startingDifficulty - Math.pow(stats, 0.9) / 250 - player.intelligence / 1600;
    // Set difficulty = 1.
    //   1 = startingDifficulty - Math.pow(stats, 0.9) / 250 - player.intelligence / 1600
    // We will assume the player does not have the intelligence stat. If they do, their EXP gain will be better.
    //   1 = startingDifficulty - Math.power(stats, 0.9) / 250
    //   1 - startingDifficulty = (-1)*Math.power(stats, 0.9) / 250
    //   startingDifficulty - 1 = Math.power(stats, 0.9) / 250
    //   (startingDifficulty - 1) * 250 = Math.power(stats, 0.9)
    //   Math.pow((startingDifficulty - 1) * 250, 1.111) = stats
    //   Math.pow((startingDifficulty - 1) , 1.111) * 461 = stats
    // Convert from total stats to average stats
    //   Math.pow((startingDifficulty - 1) , 1.111) * 92.2 = stats_average
    // Now we have the formula in the right shape, but for EXP gain, we should give less at higher
    // levels to account for the player having more augments.
    // Set up the equation with parameters:
    //   stats = Math.pow((startingDifficulty) - 1), p) * k = stats
    // 
    // k is the dominant parameter ins weak infiltrations, like n00dles,
    // p matters more in strong infiltrations, like omega or nwo.
    //
    // We'll find values for these parameters by examples.
    // A player infiltrating n00dles needs (2.5 - 1)^1.111 * 92.2 = ~152 average stats to make it easy
    //   They probably have minimal augments, maybe 1.4x stat multipliers - so 544/5 = 109 average base stats.
    // A player infiltrating alpha-ent needs (3.62 - 1)^1.11 * 92.2 = ~269 average stats
    //   They probably have some augments, maybe 2.2x stat multipliers, so = 116 average base stats.
    // A player infiltrating blade needs ~1139 average stats
    //   They probably have *lots* of augments - maybe a 7x multiplier at least 162 average base stats.
    //
    // So: f( 2.50, k, p) = 109
    //     f( 3.62, k, p) = 116
    //     f(10.59, k, p) = 162
    // 
    // This shakes out to about p=0.125, k=110.
    //
    // So: expectedBaseStatAverage = Math.pow((securityLevel-1) ^ 0.125) * 110

    const expectedBaseStatAverage = Math.pow(this.Target.startingSecurityLevel - 1, 0.125) * 110;
    const expectedRequiredExpToLevel = (calculateExp(expectedBaseStatAverage + 1)) - calculateExp(expectedBaseStatAverage);

    // Give the player approximately
    //   1% of that for difficulty=0
    //   7% of that for difficulty=1
    //  15% of that for difficulty=2
    //  26% of that for difficulty=3
    //  40% of that for difficulty=4
    // per minigame.
    //  We can get pretty close to this with (2x^2 + 5x + 1)/100.

    const difficultyFactor = (2 * Math.pow(difficulty, 2) + 5 * difficulty + 1) / 100;

    // Access levels 0 and 1 are worth reduced EXP to avoid players attacking super-targets and trying to get lucky for massive EXP payout.
    const accessLevelFactor = Math.min(this.AccessLevel / 2, 1.0);

    const baseExpGain = expectedRequiredExpToLevel * difficultyFactor * accessLevelFactor;

    var expReward = new ChallengeReward();

    // make sure to respect player.strength_exp_mult et. al
    // make sure to respect BitNodeMultipliers.InfiltrationExpGain
    expReward.HackExp = 0; // Infiltration does not give hack.
    expReward.StrExp = this.Player.strength_exp_mult * baseExpGain * BitNodeMultipliers.InfiltrationExpGain;
    expReward.DefExp = this.Player.defense_exp_mult * baseExpGain * BitNodeMultipliers.InfiltrationExpGain;
    expReward.DexExp = this.Player.dexterity_exp_mult * baseExpGain * BitNodeMultipliers.InfiltrationExpGain;
    expReward.AgiExp = this.Player.agility_exp_mult * baseExpGain * BitNodeMultipliers.InfiltrationExpGain;
    expReward.ChaExp = this.Player.charisma_exp_mult * baseExpGain * BitNodeMultipliers.InfiltrationExpGain;

    return expReward;
  }

  DrawChallengeRewards(count: number): IChallengeReward[] {
    let options = this.CreatePossibleRewards();
    let ret: IChallengeReward[] = [];

    while (ret.length < count) {
      if (options.length == 0) {
        options = this.CreatePossibleRewards();

        if (options.length == 0) {
          // If there's still no options, bail.
          //console.log(`Unable to finish generating rewards. Generated ${options.length}/${count}`);
          break;
        }
      }

      const rewardDraw: IChallengeReward = drawRandom(options)
      //console.log(`Generated reward: ${rewardDraw}`);
      ret.push(rewardDraw);
    }

    return ret;
  }

  CreatePossibleRewards(): [IChallengeReward, number][] {
    let ret: [IChallengeReward, number][] = [];

    // Access reward, appears if not at max access.
    if (this.AccessLevel < this.Target.maxClearanceLevel) {
      var accessReward = new ChallengeReward();
      accessReward.AccessAmount = 1;
      accessReward.DifficultyMod = Math.min(this.AccessLevel / 10, 1);
      ret.push([accessReward, 20]);
    }

    // First challenge is always to get access.
    //  Other rewards only show up if access level > 0.
    if (this.AccessLevel > 0) {
      // Intel rewards (x4 so more than one can be drawn)
      for (let i = 0; i < 4; ++i) {
        var intelReward = new ChallengeReward();
        intelReward.IntelAmount = this.RewardModifier * 15;

        // Draw weights for intel: 40, 30, 20, 10, 0 as cards deplete
        ret.push([intelReward, 10])
      }

      // Money reward (x2 so more than one can be drawn)
      for (let i = 0; i < 2; ++i) {
        var moneyReward = new ChallengeReward();
        moneyReward.MoneyAmount = Math.pow(this.RewardModifier, 2.2) * 4000;

        // Draw weights for money: 20, 5, 0 as cards deplete
        ret.push([moneyReward, (5 + 15 * i)]);
      }

      // Decrease alarm reward
      if (this.AlarmLevel >= 4 && this.TimesAlarmsReduced < 5) {
        var alarmReward = new ChallengeReward();
        alarmReward.ReduceAlarmLevelAmount = Math.floor(Math.min(this.AlarmLevel * (2 / 3), 10.0));
        ret.push([alarmReward, 20 - (this.TimesAlarmsReduced * 4)])
      }

      // Healing reward - appears if below 50% health
      if (this.Player.hp <= this.Player.max_hp / 2) {
        var healingReward = new ChallengeReward();
        healingReward.HealingAmount += Math.floor(this.Player.max_hp / 3);
        ret.push([healingReward, 5])
      }

      // Escape reward - appears if above the alarm threshold
      if (this.AlarmLevel > this.Target.maxAlarmLevelForEscape) {
        var escapeReward = new ChallengeReward();
        escapeReward.HasEscape = true;
        ret.push([escapeReward, 10])
      }

      // Jackpot reward. We generate jackpot rewards only 50% of the time to avoid infinite recursion.
      //  so their actual weight is 0.5 x the nominal weight of 10.
      if (Math.random() > 0.5) {
        const numberOfRewardsInPot = Math.floor(3 + Math.random() * 3); // 3-5
        const pot = this.DrawChallengeRewards(numberOfRewardsInPot);
        if (pot.length > 0) {
          var jackpotReward = pot.reduce((total, value) => combineRewards(total, value));
          jackpotReward.DifficultyMod += 0.5;

          jackpotReward.ReduceAlarmLevelAmount = Math.min(jackpotReward.ReduceAlarmLevelAmount, this.AlarmLevel);
          jackpotReward.AccessAmount = Math.min(jackpotReward.AccessAmount, this.Target.maxClearanceLevel - this.AccessLevel);

          ret.push([jackpotReward, 10])
        }
        else {
          //console.log(`Unable to gennerate jackpot reward.`);
        }
      }
    }

    return ret;
  }

  get BaseDifficulty(): number {
    return calcDifficulty(this.Player, this.Target.startingSecurityLevel)
  }

  get RewardModifier(): number {
    const levelBonus = (
      Math.pow(this.AccessLevel, 1.35)
      / Math.pow(this.Target.maxClearanceLevel, 0.65)
    );
    const difficultyBonus = this.Target.startingSecurityLevel;

    // Some example values:
    //   n00dles  @ Access  1/5   :  0.687
    //   n00dles  @ Access  5/5   :  5.575
    //   joesguns @ Access  1/5   :  0.861
    //   joesguns @ Access  5/5   :  7.000
    //   computek @ Access  1/15  :  0.411
    //   computek @ Access  5/15  :  2.594
    //   computek @ Access 10/15  :  8.207
    //   computek @ Access 15/15  : 13.904
    //
    // For parity, an attack on n00dles should get ~400 faction rep for every 5 games.
    //   If I assume that 15 challenges to get to 5/5, 
    return levelBonus * difficultyBonus;
  }
}

function drawRandom(input: [any, number][]): any {
  const totalWeight = input.map(pair => pair[1]).reduce((sum, value) => sum + value);
  let roll = Math.random() * totalWeight;

  let i = 0;
  for (i = 0; i < input.length; ++i) {
    if (roll > input[i][1]) {
      roll -= input[i][1];
    }
    else {
      break;
    }
  }

  return (input.splice(i, 1)[0])[0];
}

function combineRewards(a: IChallengeReward, b: IChallengeReward): IChallengeReward {
  return {
    IntelAmount: a.IntelAmount + b.IntelAmount,
    MoneyAmount: a.MoneyAmount + b.MoneyAmount,

    AccessAmount: a.AccessAmount + b.AccessAmount,
    ReduceAlarmLevelAmount: a.ReduceAlarmLevelAmount + b.ReduceAlarmLevelAmount,
    HealingAmount: a.HealingAmount + b.HealingAmount,

    HasEscape: a.HasEscape || b.HasEscape,
    DifficultyMod: a.DifficultyMod + b.DifficultyMod,

    HackExp: a.HackExp + b.HackExp,
    StrExp: a.StrExp + b.StrExp,
    DefExp: a.DefExp + b.DefExp,
    DexExp: a.DexExp + b.DexExp,
    AgiExp: a.AgiExp + b.AgiExp,
    ChaExp: a.ChaExp + b.ChaExp,
  }
}

/* Functions pulled from Game.tsx. Comments added to untangle them. */
function calcRawDiff(player: IPlayer, stats: number, startingDifficulty: number): number {
  const difficulty = startingDifficulty - Math.pow(stats, 0.9) / 250 - player.intelligence / 1600;
  if (difficulty < 0) return 0;
  if (difficulty > 4) return 4;
  return difficulty;
}

function calcDifficulty(player: IPlayer, startingDifficulty: number): number {
  const totalStats = player.strength + player.defense + player.dexterity + player.agility + player.charisma;
  return calcRawDiff(player, totalStats, startingDifficulty);
}

function calcReward(player: IPlayer, startingDifficulty: number): number {
  const xpMult = 10 * 60 * 15;
  const total =
    calculateSkill(player.strength_exp_mult * xpMult, player.strength_mult) +
    calculateSkill(player.defense_exp_mult * xpMult, player.defense_mult) +
    calculateSkill(player.agility_exp_mult * xpMult, player.agility_mult) +
    calculateSkill(player.dexterity_exp_mult * xpMult, player.dexterity_mult) +
    calculateSkill(player.charisma_exp_mult * xpMult, player.charisma_mult);

  return calcRawDiff(player, total, startingDifficulty);

  // Intelligence reduces rewards, as do mods, but if both of those are not present,
  //  then the multiplier = startingSecurityLevel - 1.04
  // 
  // However, Victory.tsx processes these numbers further.
  //  and includes the real, post-stats difficulty in the calculation.
  //    Faction rep = 
  //       pow(startingSecurityLevel - 0.04, 1.1) *
  //       pow(actual_difficulty, 1.2) *
  //       30
  //       pow(maximumAccessLevel, 2.01)
  // 
  // Taking all this into account, if a player is attacking a target
  //  that is difficulty 1.0 (normal) for them, the rewards are:
  //    n00dles : 2051  rep /  5 challenges
  //    joesguns: 2335  rep /  5 challenges
  //    netlink : 4020  rep /  6 challenges
  //    computek: 27945 rep / 15 challenges
  // This is affected (negatively) by augments, SF, etc. so in practice I
  //  get less than 1/4 of these values.
}