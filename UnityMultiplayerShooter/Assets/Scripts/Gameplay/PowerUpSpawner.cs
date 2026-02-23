using Fusion;
using UnityEngine;

namespace ArenaShooter.Gameplay
{
    public class PowerUpSpawner : NetworkBehaviour
    {
        [SerializeField] private PowerUpDefinition definition;
        [SerializeField] private GameObject pickupVisual;

        [Networked] private TickTimer RespawnTimer { get; set; }

        private bool _available = true;

        public override void FixedUpdateNetwork()
        {
            if (!_available && RespawnTimer.Expired(Runner))
                SetAvailable(true);
        }

        private void OnTriggerEnter(Collider other)
        {
            if (!_available || !Object.HasStateAuthority) return;

            var playerBuffs = other.GetComponentInParent<Player.PlayerBuffs>();
            if (playerBuffs == null) return;

            playerBuffs.ApplyPowerUp(definition);
            SetAvailable(false);
            RespawnTimer = TickTimer.CreateFromSeconds(Runner, definition.respawnTime);
        }

        private void SetAvailable(bool value)
        {
            _available = value;
            if (pickupVisual) pickupVisual.SetActive(value);
        }
    }
}
