using ArenaShooter.Core;
using UnityEngine;

namespace ArenaShooter.Gameplay
{
    [CreateAssetMenu(menuName = "ArenaShooter/PowerUp Definition", fileName = "PowerUpDefinition")]
    public class PowerUpDefinition : ScriptableObject
    {
        public string powerUpId;
        public PowerUpType type;
        public float duration = 6f;
        public float value = 1.2f;
        public float respawnTime = 20f;
    }
}
