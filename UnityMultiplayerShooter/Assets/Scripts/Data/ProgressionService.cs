using UnityEngine;

namespace ArenaShooter.Data
{
    public class ProgressionService : MonoBehaviour
    {
        public int Level => PlayerPrefs.GetInt("player.level", 1);
        public int Xp => PlayerPrefs.GetInt("player.xp", 0);
        public int Elo => PlayerPrefs.GetInt("player.elo", 1000);

        public void AddMatchResult(bool win, int kills, int deaths)
        {
            int xpGain = (win ? 120 : 60) + kills * 10 - deaths * 2;
            int newXp = Mathf.Max(0, Xp + xpGain);
            PlayerPrefs.SetInt("player.xp", newXp);

            int currentLevel = Level;
            int required = currentLevel * 300;
            if (newXp >= required)
            {
                PlayerPrefs.SetInt("player.level", currentLevel + 1);
                PlayerPrefs.SetInt("player.xp", newXp - required);
            }
        }

        public void UpdateElo(bool win, int opponentElo)
        {
            float expected = 1f / (1f + Mathf.Pow(10f, (opponentElo - Elo) / 400f));
            float score = win ? 1f : 0f;
            int newElo = Mathf.RoundToInt(Elo + 32f * (score - expected));
            PlayerPrefs.SetInt("player.elo", newElo);
        }
    }
}
