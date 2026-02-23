using ArenaShooter.Core;
using Fusion;
using UnityEngine;

namespace ArenaShooter.Match
{
    public class MatchManager : NetworkBehaviour
    {
        public static MatchManager Instance { get; private set; }

        [Header("Rules")]
        [SerializeField] private MatchWinCondition winCondition = MatchWinCondition.KillLimit;
        [SerializeField] private int killLimit = 10;
        [SerializeField] private float roundTimeSeconds = 300f;

        [Networked] public TickTimer MatchTimer { get; private set; }
        [Networked] public int Player1Kills { get; private set; }
        [Networked] public int Player2Kills { get; private set; }
        [Networked] public int Player1Deaths { get; private set; }
        [Networked] public int Player2Deaths { get; private set; }

        private void Awake() => Instance = this;

        public override void Spawned()
        {
            if (Object.HasStateAuthority)
                MatchTimer = TickTimer.CreateFromSeconds(Runner, roundTimeSeconds);
        }

        public override void FixedUpdateNetwork()
        {
            if (!Object.HasStateAuthority) return;

            if (MatchTimer.Expired(Runner))
                EndMatchByScore();
        }

        public void RegisterKill(PlayerRef killer, PlayerRef victim)
        {
            if (!Object.HasStateAuthority) return;

            if (killer.RawEncoded == 1) Player1Kills++;
            else Player2Kills++;

            if (victim.RawEncoded == 1) Player1Deaths++;
            else Player2Deaths++;

            Runner.StartCoroutine(RespawnAfterDelay(victim, 3f));

            if (winCondition == MatchWinCondition.KillLimit && (Player1Kills >= killLimit || Player2Kills >= killLimit))
                EndMatchByScore(finalKillSlowMotion: true);
        }

        private System.Collections.IEnumerator RespawnAfterDelay(PlayerRef player, float delay)
        {
            yield return new WaitForSeconds(delay);
            var spawnSystem = FindObjectOfType<Gameplay.SpawnSystem>();
            spawnSystem?.RespawnPlayer(player);
        }

        private void EndMatchByScore(bool finalKillSlowMotion = false)
        {
            if (finalKillSlowMotion) Time.timeScale = 0.3f;
            Debug.Log("Match Ended");
        }
    }
}
