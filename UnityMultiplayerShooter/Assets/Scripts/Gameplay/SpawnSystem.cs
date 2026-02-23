using Fusion;
using UnityEngine;

namespace ArenaShooter.Gameplay
{
    public class SpawnSystem : NetworkBehaviour
    {
        [SerializeField] private NetworkObject playerPrefab;
        [SerializeField] private Transform[] spawnPoints;

        public override void PlayerJoined(PlayerRef player)
        {
            if (!Object.HasStateAuthority) return;
            SpawnPlayer(player);
        }

        public void RespawnPlayer(PlayerRef player) => SpawnPlayer(player);

        private void SpawnPlayer(PlayerRef player)
        {
            int index = Mathf.Abs(player.RawEncoded) % spawnPoints.Length;
            var t = spawnPoints[index];

            Runner.Spawn(playerPrefab, t.position, t.rotation, player, (runner, obj) =>
            {
                var health = obj.GetComponent<Combat.HealthComponent>();
                health?.ResetState();
            });
        }
    }
}
