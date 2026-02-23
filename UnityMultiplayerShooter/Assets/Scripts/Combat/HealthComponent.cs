using Fusion;
using UnityEngine;

namespace ArenaShooter.Combat
{
    public class HealthComponent : NetworkBehaviour
    {
        [Networked] public int Health { get; private set; }
        [Networked] public int Shield { get; private set; }
        [Networked] public TickTimer SpawnProtectionTimer { get; private set; }

        [SerializeField] private int maxHealth = 100;
        [SerializeField] private int maxShield = 50;

        public bool IsDead => Health <= 0;
        public bool IsSpawnProtected => SpawnProtectionTimer.IsRunning;

        public override void Spawned()
        {
            if (Object.HasStateAuthority)
            {
                ResetState();
            }
        }

        [Rpc(RpcSources.All, RpcTargets.StateAuthority)]
        public void RpcRequestDamage(int rawDamage, bool isHeadshot, PlayerRef attacker)
        {
            if (!Object.HasStateAuthority || IsDead || IsSpawnProtected) return;

            var damage = isHeadshot ? Mathf.RoundToInt(rawDamage * 1.8f) : rawDamage;

            if (Shield > 0)
            {
                int shieldHit = Mathf.Min(Shield, damage);
                Shield -= shieldHit;
                damage -= shieldHit;
            }

            Health = Mathf.Max(Health - damage, 0);

            if (Health <= 0)
            {
                Match.MatchManager.Instance?.RegisterKill(attacker, Object.InputAuthority);
            }
        }

        public void ResetState()
        {
            Health = maxHealth;
            Shield = maxShield;
            SpawnProtectionTimer = TickTimer.CreateFromSeconds(Runner, 2f);
        }
    }
}
