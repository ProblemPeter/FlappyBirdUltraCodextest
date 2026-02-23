namespace ArenaShooter.Core
{
    public enum MatchType
    {
        Casual = 0,
        Ranked = 1,
        Custom = 2
    }

    public enum MatchWinCondition
    {
        BestOfFiveRounds = 0,
        KillLimit = 1
    }

    public enum WeaponRarity
    {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary
    }

    public enum FireMode
    {
        Hitscan,
        Projectile
    }

    public enum PowerUpType
    {
        DamageBoost,
        ShieldBoost,
        SpeedBoost,
        InstantReload
    }
}
