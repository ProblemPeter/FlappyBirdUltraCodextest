using System.Collections.Generic;
using UnityEngine;

namespace ArenaShooter.Pooling
{
    public class PoolManager : MonoBehaviour
    {
        public static PoolManager Instance { get; private set; }

        private readonly Dictionary<GameObject, Queue<GameObject>> _pools = new();

        private void Awake() => Instance = this;

        public GameObject Get(GameObject prefab, Vector3 pos, Quaternion rot)
        {
            if (!_pools.TryGetValue(prefab, out var queue))
            {
                queue = new Queue<GameObject>();
                _pools[prefab] = queue;
            }

            GameObject instance = null;
            while (queue.Count > 0 && instance == null)
                instance = queue.Dequeue();

            if (instance == null)
                instance = Instantiate(prefab);

            instance.transform.SetPositionAndRotation(pos, rot);
            instance.SetActive(true);
            return instance;
        }

        public void Return(GameObject prefab, GameObject instance)
        {
            instance.SetActive(false);
            _pools[prefab].Enqueue(instance);
        }
    }
}
