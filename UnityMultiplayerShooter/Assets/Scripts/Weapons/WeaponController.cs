using ArenaShooter.Network;
using ArenaShooter.Pooling;
using Fusion;
using UnityEngine;

namespace ArenaShooter.Weapons
{
    public class WeaponController : NetworkBehaviour
    {
        [SerializeField] private WeaponDefinition[] loadout;
        [SerializeField] private Transform muzzle;

        [Networked] public int ActiveWeaponIndex { get; private set; }
        [Networked] public int AmmoInMag { get; private set; }
        [Networked] private TickTimer ReloadTimer { get; set; }
        [Networked] private TickTimer NextFireTimer { get; set; }

        private bool _reloadApplied;
        public WeaponDefinition ActiveWeapon => loadout[ActiveWeaponIndex];

        public override void Spawned()
        {
            if (Object.HasStateAuthority) Equip(0);
        }

        public override void FixedUpdateNetwork()
        {
            if (ReloadTimer.Expired(Runner) && !_reloadApplied)
            {
                AmmoInMag = ActiveWeapon.magazineSize;
                _reloadApplied = true;
            }

            if (!GetInput(out NetworkInputData input)) return;

            if (input.Buttons.WasPressed(Runner, NetworkInputData.SwitchWeapon))
                Equip(input.SelectedWeaponSlot % loadout.Length);
            if (input.Buttons.WasPressed(Runner, NetworkInputData.Reload))
                StartReload();
            if (input.Buttons.IsSet(NetworkInputData.Fire))
                TryFire();
        }

        private void Equip(int index)
        {
            if (index < 0 || index >= loadout.Length) return;
            ActiveWeaponIndex = index;
            AmmoInMag = ActiveWeapon.magazineSize;
        }

        private void StartReload()
        {
            if (ReloadTimer.IsRunning || AmmoInMag == ActiveWeapon.magazineSize) return;
            ReloadTimer = TickTimer.CreateFromSeconds(Runner, ActiveWeapon.reloadTime);
            _reloadApplied = false;
        }

        private void TryFire()
        {
            if (!Object.HasStateAuthority || ReloadTimer.IsRunning || NextFireTimer.IsRunning || AmmoInMag <= 0) return;

            AmmoInMag--;
            NextFireTimer = TickTimer.CreateFromSeconds(Runner, 1f / Mathf.Max(1f, ActiveWeapon.fireRate));

            var origin = muzzle.position;
            var direction = muzzle.forward;

            if (ActiveWeapon.fireMode == Core.FireMode.Hitscan) FireHitscan(origin, direction);
            else FireProjectile(origin, direction);

            RpcOnWeaponFired();
        }

        private void FireHitscan(Vector3 origin, Vector3 direction)
        {
            if (Runner.LagCompensation.Raycast(origin, direction, 120f, Object.InputAuthority, out var hit, ~0, HitOptions.IncludePhysX))
            {
                var health = hit.GameObject.GetComponent<Combat.HealthComponent>();
                if (health != null)
                {
                    bool headshot = hit.GameObject.CompareTag("Head");
                    health.RpcRequestDamage(ActiveWeapon.damage, headshot, Object.InputAuthority);
                }
            }
        }

        private void FireProjectile(Vector3 origin, Vector3 direction)
        {
            var projectile = PoolManager.Instance.Get(ActiveWeapon.projectilePrefab, origin, Quaternion.LookRotation(direction));
            projectile.GetComponent<ProjectileBehaviour>()?.Initialize(Object.InputAuthority, ActiveWeapon.damage, direction);
        }

        [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
        private void RpcOnWeaponFired()
        {
            if (ActiveWeapon.muzzleFlashPrefab)
                Instantiate(ActiveWeapon.muzzleFlashPrefab, muzzle.position, muzzle.rotation);
        }
    }
}
