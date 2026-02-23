using ArenaShooter.Network;
using UnityEngine;
using UnityEngine.EventSystems;

namespace ArenaShooter.Input
{
    /// <summary>
    /// Aggregiert Touch-Eingaben in ein Fusion-kompatibles Input-Struct.
    /// Keine externen Plugins erforderlich.
    /// </summary>
    public class MobileInputController : MonoBehaviour
    {
        [Header("Virtual Joystick")]
        [SerializeField] private RectTransform joystickHandle;
        [SerializeField] private float joystickRadius = 80f;

        [Header("Look Swipe")]
        [SerializeField] private float lookSensitivity = 0.12f;

        [Header("Aim Assist")]
        [SerializeField] private bool aimAssistEnabled = true;
        [SerializeField] private float aimAssistStrength = 0.1f;

        public NetworkInputData CurrentInput { get; private set; }

        private Vector2 _joystickStart;
        private int _moveTouchId = -1;
        private int _lookTouchId = -1;

        public void SetButtonState(int index, bool pressed)
        {
            if (pressed) CurrentInput.Buttons.Set(index);
            else CurrentInput.Buttons.Set(index, false);
        }

        public void SetWeaponSlot(int slot)
        {
            CurrentInput.SelectedWeaponSlot = (byte)Mathf.Clamp(slot, 0, 5);
        }

        private void Update()
        {
            CurrentInput.LookDelta = Vector2.zero;
            CurrentInput.Move = Vector2.zero;

            for (var i = 0; i < UnityEngine.Input.touchCount; i++)
            {
                var touch = UnityEngine.Input.GetTouch(i);
                bool leftHalf = touch.position.x < Screen.width * 0.5f;

                if (leftHalf)
                {
                    HandleMoveTouch(touch);
                }
                else
                {
                    HandleLookTouch(touch);
                }
            }

            if (aimAssistEnabled)
            {
                ApplyAimAssist();
            }
        }

        private void HandleMoveTouch(Touch touch)
        {
            if (_moveTouchId == -1 && touch.phase == TouchPhase.Began)
            {
                _moveTouchId = touch.fingerId;
                _joystickStart = touch.position;
            }

            if (touch.fingerId != _moveTouchId) return;

            if (touch.phase == TouchPhase.Canceled || touch.phase == TouchPhase.Ended)
            {
                _moveTouchId = -1;
                if (joystickHandle) joystickHandle.anchoredPosition = Vector2.zero;
                return;
            }

            var delta = touch.position - _joystickStart;
            delta = Vector2.ClampMagnitude(delta, joystickRadius);
            CurrentInput.Move = delta / joystickRadius;

            if (joystickHandle) joystickHandle.anchoredPosition = delta;
        }

        private void HandleLookTouch(Touch touch)
        {
            if (_lookTouchId == -1 && touch.phase == TouchPhase.Began)
            {
                _lookTouchId = touch.fingerId;
            }

            if (touch.fingerId != _lookTouchId) return;

            if (touch.phase == TouchPhase.Canceled || touch.phase == TouchPhase.Ended)
            {
                _lookTouchId = -1;
                return;
            }

            CurrentInput.LookDelta = touch.deltaPosition * lookSensitivity;
        }

        private void ApplyAimAssist()
        {
            // Leichter Aim Assist: hier nur Placeholder-Korrektur für horizontale Achse.
            // In Produktion: Zielerfassung per SphereCast und sanfte Rotation auf Target-Bounds.
            CurrentInput.LookDelta *= (1f + aimAssistStrength);
        }
    }

    public class InputButtonBinder : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
    {
        [SerializeField] private MobileInputController input;
        [SerializeField] private int buttonIndex;

        public void OnPointerDown(PointerEventData eventData) => input.SetButtonState(buttonIndex, true);
        public void OnPointerUp(PointerEventData eventData) => input.SetButtonState(buttonIndex, false);
    }
}
