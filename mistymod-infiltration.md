#MistyMod-Infiltration

During an infiltration, the player tries to accumulate Intel and then escape by playing minigames. If they successfully escape, their accumulated intel can be cashed out for rep or money.

## Highlights
* Infiltrations are **much** longer, with the option to keep going even at maximum access level for additional rewards. (It does get harder and harder, though)
* At each step in an infiltration, you can choose betwene one of three games, with different rewards for each game.
* You can exit an infiltration early for partial rewards.
* Infiltration is worth EXP
* Non-EXP Infiltration rewards no longer scale negatively with level
* The difficulty on the games is changed. Some are easier, some are harder. Hopefully should be overall smoother.
* UI improvements to some of the games, including numpad support

## Caveats
* Steam achievements are disabled in the release copies. (You can add achievements back in easily if you download the source)
* Binary releases are only available for Windows x64 and Linux x64 (but can be built from source).

## Infiltration Stats

During infiltration, the following stats are tracked.

### Intel

Intel determines the final reward. After successfully escaping, it can be exchanged for money or faction reputation. Intel's value is greater-than-linear; twice as much intel will return more than twice as much money or rep, so a long infiltration is better than a bunch of short ones. (Probably something like pow(intel, 1.1))

~~Each target will have a maximum amount of Intel that can be extracted from them, which persists between infiltrations and regenerates slowly. (There's only *so much* you can say about a ramen bar before people stop paying you for it.)~~ -- This didn't make it in to the current version. It would have required adding more data to save files, as well as having it correctly reset over bitnodes and augment installs. I'll look into doing this later.

### Access Level

Access Level determines how large the Intel and Money rewards are for each game. It starts at 0 and can be increased as a challenge reward.

The formula by which rewards are modified is something like `pow(accessLevel, 1.3) * pow(0.6, corp.maximumAccess)`, so corps with high maximum access levels will give very low rewards at low access, but quite a bit larger rewards at high access.

Each corp has a maximum access level preserved exactly from the maximum infiltration depth in the base game. (5 for the noodle bar, 20 for Global Pharmaceuticals, etc.)

### Alarm Level

Alarm Level increases the difficult each game is. Each game increases the alarm level by a fixed amount, regardless of whether the player succeeds or fails. A reward can reduce the alarm level.

Numbers will be something like alarm level going up by 1 per challenge completed. Alarm level reduction rewards reduce it by a portion of its current value (66%), with a maximum reduction (like 10). Every 10 points of alarm level increases the difficulty of minigames by 1 tier. (Trivial -> Easy -> Normal -> Hard -> Impossible).

### Escape Threshold

Each target has an escape threshold. If the alarm level is above the escape threshold, escaping between challenges is no longer possible. Escape will be offered as a challenge reward instead.

*Currently, every target has an equal escape threshold at 10, as a placeholder.*

## Challenge Select Screen

Upon initiating infiltration and after each minigame, the player is sent to the challenge select screen. From this screen, they can choose a one of three challenges (minigames) to progress with, or escape.

### Escaping

As long as the player's alarm level is below the company's escape threshold, they can cash out their Intel from the challenge select screen.

Cancelling the infiltration is possible at any time, (even during a minigame), but doing so forfeits the rewards, as does running out of HP.

## Possible Rewards

Each challenge offered will have a reward associated with it, which is displayed to the player at the challenge select screen. (The "percentages" given in parentheses for each reward are weights. These are *approximately* percentages, but they're variable so they might add up to anywhere from 92.5 to 117.5 depending on circumstances)

Some rewards raise or lower the difficulty of the challenge they are attached to.

### Intel

Successful completion of this game will award  Intel, which is added to the player's Intel pool.

Rarity: Very Common (~40% & can appear more than once is the same set of challenges)
Difficulty: +0

### Money

Successful completion of this game will award Money. Unlike intel, money is retained even after a failed infiltration.

Rarity: Common (~20%)
Difficulty: +0

### Healing

Successful completion of this game will restore some of the player's HP.

Rarity: Rare (~5%), only appears when below half HP.
Difficulty: +1

### Increase Access

Successful completion of this game will increase the player's access level.

Rarity: Common (~20%), only appears when below the max security level for the target.
Difficulty: +0.5

### Decrease Alarm

Successful completion of this game will decrease the player's alarm level.

Rarity: Starts out Common (20%), but becomes a little less common each time it's picked.
Difficulty: +0.5

### Escape

Successful completion of this game will end the infiltration and allow the player to cash out their rewards.

Rarity: Uncommon (~10%), only appears after alarm exceeds the escape threshold
Difficulty: -1

### Jackpot! (Multiple Rewards)

Occasionally, an option will be generated with greatly increased rewards, rolling 3-5 times on the table. Intel and Money can be rolled more than once. Rewards rolled as part of this reward can be duplicates of rewards offered by other challenges. *Jackpot!* can be rolled recursively, creating an even larger reward.

Escape is **not** optional. If a *Jackpot!* contains Escape, claiming it ends the infiltration.

Rarity: Very Rare (~2.5%)
Difficulty: +1, +modifiers from other rolled options.
