using ArenaShooter.Core;
using UnityEngine;

namespace ArenaShooter.Match
{
    [CreateAssetMenu(menuName = "ArenaShooter/Match Config", fileName = "MatchConfig")]
    public class MatchConfig : ScriptableObject
    {
        public MatchWinCondition winCondition = MatchWinCondition.KillLimit;
        public int killLimit = 10;
        public int roundsToWin = 3;
        public float roundTimeSeconds = 300f;
    }
}
