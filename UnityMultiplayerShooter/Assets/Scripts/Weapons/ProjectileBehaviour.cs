using Fusion;
using UnityEngine;

namespace ArenaShooter.Weapons
{
    public class ProjectileBehaviour : NetworkBehaviour
    {
        [SerializeField] private float speed = 45f;
        [SerializeField] private float lifeTime = 4f;

        private PlayerRef _owner;
        private int _damage;
        private Vector3 _direction;
        private float _deathTime;

        public void Initialize(PlayerRef owner, int damage, Vector3 direction)
        {
            _owner = owner;
            _damage = damage;
            _direction = direction.normalized;
            _deathTime = Time.time + lifeTime;
        }

        private void Update()
        {
            transform.position += _direction * speed * Time.deltaTime;

            if (Time.time >= _deathTime)
            {
                gameObject.SetActive(false);
            }
        }

        private void OnTriggerEnter(Collider other)
        {
            var health = other.GetComponentInParent<Combat.HealthComponent>();
            if (health != null)
            {
                bool headshot = other.CompareTag("Head");
                health.RpcRequestDamage(_damage, headshot, _owner);
            }

            gameObject.SetActive(false);
        }
    }
}
