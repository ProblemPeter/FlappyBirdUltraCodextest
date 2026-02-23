using System.Threading.Tasks;
using ArenaShooter.Core;
using UnityEngine;

namespace ArenaShooter.Network
{
    public class MatchmakingService : MonoBehaviour
    {
        [SerializeField] private NetworkBootstrap bootstrap;

        public Task QueueRankedAsync() => bootstrap.StartMatchAsync(MatchType.Ranked);
        public Task QueueCasualAsync() => bootstrap.StartMatchAsync(MatchType.Casual);
        public Task CreateCustomRoomAsync() => bootstrap.StartMatchAsync(MatchType.Custom);
    }
}
