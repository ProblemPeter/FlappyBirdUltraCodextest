using ArenaShooter.Core;
using ArenaShooter.Gameplay;
using Fusion;
using UnityEngine;

namespace ArenaShooter.Player
{
    public class PlayerBuffs : NetworkBehaviour
    {
        [Networked] private TickTimer BuffTimer { get; set; }
        [Networked] private PowerUpType ActiveType { get; set; }
        [Networked] private float ActiveValue { get; set; }

        private Weapons.WeaponController _weaponController;
        private NetworkPlayerController _movement;

        private void Awake()
        {
            _weaponController = GetComponent<Weapons.WeaponController>();
            _movement = GetComponent<NetworkPlayerController>();
        }

        public void ApplyPowerUp(PowerUpDefinition definition)
        {
            if (!Object.HasStateAuthority) return;

            ActiveType = definition.type;
            ActiveValue = definition.value;
            BuffTimer = TickTimer.CreateFromSeconds(Runner, definition.duration);

            if (ActiveType == PowerUpType.InstantReload)
            {
                // direkter Effekt, danach Ende
                BuffTimer = TickTimer.None;
            }
        }

        public override void FixedUpdateNetwork()
        {
            if (BuffTimer.Expired(Runner))
            {
                ActiveValue = 0f;
            }
        }
    }
}
