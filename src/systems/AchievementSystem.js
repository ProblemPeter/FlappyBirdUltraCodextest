export class AchievementSystem {
  constructor(persistentState) {
    this.state = persistentState;
    this.definitions = [
      { id: 'score10', text: 'Rookie Flyer', condition: (r) => r.score >= 10 },
      { id: 'score50', text: 'Sky Veteran', condition: (r) => r.score >= 50 },
      { id: 'combo5', text: 'Combo Pilot', condition: (r) => r.maxCombo >= 5 },
      { id: 'powerup10', text: 'Power Collector', condition: (r) => r.powerUpUses >= 10 },
    ];
  }

  evaluate(runStats) {
    const unlocked = [];
    for (const item of this.definitions) {
      if (!this.state.achievements[item.id] && item.condition(runStats)) {
        this.state.achievements[item.id] = true;
        unlocked.push(item.text);
      }
    }
    return unlocked;
  }
}
