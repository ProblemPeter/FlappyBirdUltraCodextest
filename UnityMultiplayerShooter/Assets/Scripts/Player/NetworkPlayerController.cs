using ArenaShooter.Network;
using Fusion;
using UnityEngine;

namespace ArenaShooter.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class NetworkPlayerController : NetworkBehaviour
    {
        [SerializeField] private Camera playerCamera;
        [SerializeField] private float moveSpeed = 5.5f;
        [SerializeField] private float lookClamp = 80f;

        [Networked] public float Pitch { get; set; }
        [Networked] public Vector3 Velocity { get; set; }

        private CharacterController _controller;
        private float _yaw;

        public override void Spawned()
        {
            _controller = GetComponent<CharacterController>();
            if (Object.HasInputAuthority)
            {
                playerCamera.enabled = true;
            }
            else
            {
                playerCamera.enabled = false;
                playerCamera.GetComponent<AudioListener>().enabled = false;
            }
        }

        public override void FixedUpdateNetwork()
        {
            if (GetInput(out NetworkInputData input))
            {
                Simulate(input);
            }
        }

        private void Simulate(NetworkInputData input)
        {
            _yaw += input.LookDelta.x;
            Pitch = Mathf.Clamp(Pitch - input.LookDelta.y, -lookClamp, lookClamp);

            transform.rotation = Quaternion.Euler(0f, _yaw, 0f);
            playerCamera.transform.localRotation = Quaternion.Euler(Pitch, 0f, 0f);

            var move = transform.forward * input.Move.y + transform.right * input.Move.x;
            Velocity = move * moveSpeed;
            _controller.Move(Velocity * Runner.DeltaTime);
        }
    }
}
