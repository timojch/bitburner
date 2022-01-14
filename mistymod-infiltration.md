#MistyMod-Infiltration

During an infiltration, the player tries to accumulate Intel and then escape by playing minigames. If they successfully escape, their accumulated intel can be cashed out for rep or money.

## Goals

The goal of this mod is...

1. To make infiltration more strategic / *Players feel like they're making choices during infiltrations.*
2. To make infiltration more enticing / *Players should be excited to try to infiltrate a target even if their stats aren't high enough to fully infiltrate it.*
3. To make infiltration less repetitive / *Players should get their fill of infiltration in a single go - they should not immediately re-enter an infiltration after completing one.*
4. To preserve compatibility with existing interfaces / *I can update this mod easily if hydroflame adds a new minigame*

## Non-goals

The goal of this mod is NOT...

1. To make infiltration easier. / *Players should NOT full-clear infiltrations at lower stat levels than they could in the un-modded version.*
2. To substantially increase infiltration rewards / *Players should NOT get substantially more rewards for the same amount of time spent infiltrating, on average, as they could in the un-modded version.*

## Infiltration Stats

During infiltration, the following stats are tracked.

### Intel

Intel determines the final reward. After successfully escaping, it can be exchanged for money or faction reputation. Intel's value is greater-than-linear; twice as much intel will return more than twice as much money or rep, so a long infiltration is better than a bunch of short ones. (Probably something like pow(intel, 1.1))

Each target will have a maximum amount of Intel that can be extracted from them, which persists between infiltrations and regenerates slowly. (There's only *so much* you can say about a ramen bar before people stop paying you for it.)

### Access Level

Access Level determines how large the Intel and Money rewards are for each game. It starts at 0 and can be increased as a challenge reward.

The formula by which rewards are modified is something like `pow(corp.maximumAccess, 2) * pow(0.65, corp.maximumAccess - accessLevel)`, so corps with high maximum access levels will give very low rewards at low access, but quite a bit larger rewards at high access.

Each corp has a maximum access level preserved exactly from the maximum infiltration depth in the base game. (5 for the noodle bar, 20 for Global Pharmaceuticals, etc.)

### Alarm Level

Alarm Level increases the difficult each game is. Each game increases the alarm level by a fixed amount, regardless of whether the player succeeds or fails. A reward can reduce the alarm level.

Numbers will be something like alarm level going up by 0.1 per challenge completed. Alarm level reduction rewards reduce it by a portion of its current value (like 60%), with a maximum reduction (like 1.0). An alarm level of 1.0 increases the difficulty of all challenges by 1 level.

### Escape Threshold

Each target has an escape threshold. If the alarm level is above the escape threshold, escaping between challenges is no longer possible. Escape will be offered as a challenge reward instead.

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

Rarity: Very Common (~45% & can appear more than once is the same set of challenges)
Difficulty: +0

### Money

Successful completion of this game will award Money. Unlike intel, money is retained even after a failed infiltration.

Rarity: Common (~20%)
Difficulty: +0

### Healing

Successful completion of this game will increase the player's current HP.

Rarity: Nonexistant scaling up to uncommon as player's HP decreases. (~0-10%)
Difficulty: +1

### Increase Access

Successful completion of this game will increase the player's access level.

Rarity: Common (~20%), only appears when below the max security level for the target.
Difficulty: +0.5

### Decrease Alarm

Successful completion of this game will decrease the player's alarm level.

Rarity: Rare (5%-10%), scaling up to Uncommon at high alarm levels
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

## Stretch Goals

After I finish the above, if I haven't gotten sick of it, I might do something from the following.

### Maybe-do Features
* Change the way stats impact challenges - for example, Dexterity and Agility might increase the time limits on some games, while Strength, Charisma, and Hacking decrease their difficulties. Defense already affects HP, so probably not much to do there. (Might need to be careful with Hack; it's much easier to get a high hacking stat than physical stats in the early game. Also this contradicts design goal #4.)
* Make challenges award EXP
* Do a difficulty pass to bring the different challenge minigames more into alignment. Need more playtesters for this, though. Just because **I** can't seem to win at *Match the Symbols!* no matter how hard I try doesn't mean it's actually overtuned.

### Other ideas
* Make different factions like Intel on different targets. Slum Snakes might want to know about Aevum Police and Joes Guns, while NiteSec is more interested in technology companies)
* Add more infiltration targets (including the three-letter agencies)
* Add some new unique augments could be offered as super rare challenge rewards - steal a prototype *DataJack II* from OmniTech!

### Half-assed ideas
* Add a BitNode that's all about infiltration. (Maybe have servers require infiltration to open ports?)