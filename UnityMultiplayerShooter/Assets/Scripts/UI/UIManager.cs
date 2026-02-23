using ArenaShooter.Match;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace ArenaShooter.UI
{
    public class UIManager : MonoBehaviour
    {
        [Header("HUD")]
        [SerializeField] private Slider hpBar;
        [SerializeField] private Slider shieldBar;
        [SerializeField] private TMP_Text ammoText;
        [SerializeField] private TMP_Text scoreText;
        [SerializeField] private TMP_Text timerText;
        [SerializeField] private TMP_Text pingText;
        [SerializeField] private TMP_Text enemyHpOnHitText;

        [Header("End Screen")]
        [SerializeField] private GameObject endScreen;
        [SerializeField] private TMP_Text resultText;

        private Combat.HealthComponent _playerHealth;
        private Weapons.WeaponController _weapon;

        public void BindPlayer(Combat.HealthComponent health, Weapons.WeaponController weapon)
        {
            _playerHealth = health;
            _weapon = weapon;
        }

        private void Update()
        {
            if (_playerHealth != null)
            {
                hpBar.value = _playerHealth.Health / 100f;
                shieldBar.value = _playerHealth.Shield / 50f;
            }

            if (_weapon != null)
                ammoText.text = $"{_weapon.AmmoInMag}";

            if (MatchManager.Instance != null)
            {
                scoreText.text = $"{MatchManager.Instance.Player1Kills} : {MatchManager.Instance.Player2Kills}";
            }
        }

        public void ShowEnemyHpOnHit(int hp)
        {
            enemyHpOnHitText.text = hp.ToString();
        }

        public void ShowMatchEnd(bool win)
        {
            endScreen.SetActive(true);
            resultText.text = win ? "Sieg" : "Niederlage";
        }
    }
}
