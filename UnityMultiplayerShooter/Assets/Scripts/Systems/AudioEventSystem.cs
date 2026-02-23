using UnityEngine;

namespace ArenaShooter.Systems
{
    public class AudioEventSystem : MonoBehaviour
    {
        [SerializeField] private AudioSource sfxSource;
        [SerializeField] private AudioClip footstepClip;
        [SerializeField] private AudioClip hitClip;
        [SerializeField] private AudioClip killClip;

        public void PlayFootstep() => Play(footstepClip);
        public void PlayHit() => Play(hitClip);
        public void PlayKill() => Play(killClip);

        private void Play(AudioClip clip)
        {
            if (clip == null || sfxSource == null) return;
            sfxSource.PlayOneShot(clip);
        }
    }
}
