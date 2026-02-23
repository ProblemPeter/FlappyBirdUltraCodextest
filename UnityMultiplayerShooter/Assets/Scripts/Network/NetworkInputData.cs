using Fusion;
using UnityEngine;

namespace ArenaShooter.Network
{
    public struct NetworkInputData : INetworkInput
    {
        public Vector2 Move;
        public Vector2 LookDelta;
        public NetworkButtons Buttons;
        public byte SelectedWeaponSlot;

        public const int Fire = 0;
        public const int Aim = 1;
        public const int Reload = 2;
        public const int SwitchWeapon = 3;
        public const int ThrowGrenade = 4;
        public const int Jump = 5;
    }
}
