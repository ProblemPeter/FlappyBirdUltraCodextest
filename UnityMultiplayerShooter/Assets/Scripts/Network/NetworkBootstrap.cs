using System;
using System.Threading.Tasks;
using ArenaShooter.Core;
using Fusion;
using Fusion.Sockets;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace ArenaShooter.Network
{
    public class NetworkBootstrap : MonoBehaviour, INetworkRunnerCallbacks
    {
        [SerializeField] private NetworkRunner runnerPrefab;
        [SerializeField] private string gameplayScene = "Arena_1v1";

        private NetworkRunner _runner;

        public async Task StartMatchAsync(MatchType type)
        {
            if (_runner != null) return;

            _runner = Instantiate(runnerPrefab);
            _runner.ProvideInput = true;
            _runner.AddCallbacks(this);

            var roomName = type switch
            {
                MatchType.Ranked => "ranked_1v1",
                MatchType.Casual => "casual_1v1",
                _ => $"custom_{Guid.NewGuid():N}".Substring(0, 10)
            };

            var sceneRef = SceneRef.FromIndex(SceneUtility.GetBuildIndexByScenePath($"Assets/Scenes/{gameplayScene}.unity"));

            var args = new StartGameArgs
            {
                GameMode = GameMode.Shared,
                SessionName = roomName,
                Scene = sceneRef,
                PlayerCount = 2,
                IsVisible = true,
                IsOpen = true
            };

            var result = await _runner.StartGame(args);
            if (!result.Ok)
            {
                Debug.LogError($"[NetworkBootstrap] StartGame fehlgeschlagen: {result.ShutdownReason}");
            }
        }

        public void OnPlayerJoined(NetworkRunner runner, PlayerRef player) => Debug.Log($"Player joined: {player}");
        public void OnPlayerLeft(NetworkRunner runner, PlayerRef player) => Debug.Log($"Player left: {player}");
        public void OnInput(NetworkRunner runner, NetworkInput input)
        {
            var mobileInput = FindObjectOfType<Input.MobileInputController>();
            if (mobileInput != null)
            {
                input.Set(mobileInput.CurrentInput);
            }
        }

        public void OnInputMissing(NetworkRunner runner, PlayerRef player, NetworkInput input) { }
        public void OnShutdown(NetworkRunner runner, ShutdownReason shutdownReason) { }
        public void OnConnectedToServer(NetworkRunner runner) { }
        public void OnDisconnectedFromServer(NetworkRunner runner, NetDisconnectReason reason) { }
        public void OnConnectRequest(NetworkRunner runner, NetworkRunnerCallbackArgs.ConnectRequest request, byte[] token) { }
        public void OnConnectFailed(NetworkRunner runner, NetAddress remoteAddress, NetConnectFailedReason reason) { }
        public void OnUserSimulationMessage(NetworkRunner runner, SimulationMessagePtr message) { }
        public void OnSessionListUpdated(NetworkRunner runner, System.Collections.Generic.List<SessionInfo> sessionList) { }
        public void OnCustomAuthenticationResponse(NetworkRunner runner, System.Collections.Generic.Dictionary<string, object> data) { }
        public void OnHostMigration(NetworkRunner runner, HostMigrationToken hostMigrationToken) { }
        public void OnSceneLoadDone(NetworkRunner runner) { }
        public void OnSceneLoadStart(NetworkRunner runner) { }
        public void OnObjectExitAOI(NetworkRunner runner, NetworkObject obj, PlayerRef player) { }
        public void OnObjectEnterAOI(NetworkRunner runner, NetworkObject obj, PlayerRef player) { }
        public void OnReliableDataReceived(NetworkRunner runner, PlayerRef player, ReliableKey key, System.ArraySegment<byte> data) { }
        public void OnReliableDataProgress(NetworkRunner runner, PlayerRef player, ReliableKey key, float progress) { }
    }
}
