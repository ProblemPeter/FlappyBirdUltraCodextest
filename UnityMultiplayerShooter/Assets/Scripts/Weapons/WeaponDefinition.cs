using ArenaShooter.Core;
using UnityEngine;

namespace ArenaShooter.Weapons
{
    [CreateAssetMenu(menuName = "ArenaShooter/Weapon Definition", fileName = "WeaponDefinition")]
    public class WeaponDefinition : ScriptableObject
    {
        public string weaponId;
        public string displayName;
        public WeaponRarity rarity;
        public int upgradeLevel;

        [Header("Combat")]
        public int damage = 25;
        public float fireRate = 8f;
        public int magazineSize = 30;
        public float reloadTime = 2f;
        public float recoil = 1.2f;
        public float spread = 0.8f;
        public float headshotMultiplier = 1.8f;
        public FireMode fireMode = FireMode.Hitscan;

        [Header("References")]
        public GameObject projectilePrefab;
        public GameObject muzzleFlashPrefab;
        public AudioClip fireSfx;
    }
}
