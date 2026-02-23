using UnityEngine;

namespace ArenaShooter.Systems
{
    public class EffectsSystem : MonoBehaviour
    {
        [SerializeField] private AnimationCurve shakeCurve;
        [SerializeField] private float shakeDuration = 0.15f;
        [SerializeField] private float shakeStrength = 0.15f;

        public void TriggerScreenShake(Transform cameraTransform)
        {
            StartCoroutine(ShakeRoutine(cameraTransform));
        }

        private System.Collections.IEnumerator ShakeRoutine(Transform t)
        {
            var start = t.localPosition;
            float timer = 0f;
            while (timer < shakeDuration)
            {
                timer += Time.deltaTime;
                float intensity = shakeCurve.Evaluate(timer / shakeDuration) * shakeStrength;
                t.localPosition = start + Random.insideUnitSphere * intensity;
                yield return null;
            }

            t.localPosition = start;
        }
    }
}
