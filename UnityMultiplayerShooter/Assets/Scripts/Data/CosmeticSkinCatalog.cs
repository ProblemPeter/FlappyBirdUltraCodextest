using System;
using System.Collections.Generic;
using UnityEngine;

namespace ArenaShooter.Data
{
    [CreateAssetMenu(menuName = "ArenaShooter/Cosmetic Skin Catalog", fileName = "CosmeticSkinCatalog")]
    public class CosmeticSkinCatalog : ScriptableObject
    {
        [Serializable]
        public class SkinEntry
        {
            public string skinId;
            public string displayName;
            public Material weaponMaterial;
            public bool unlockedByDefault;
        }

        public List<SkinEntry> skins = new();
    }
}
