# Arena Setup (1v1 symmetrisch)

## Layout
- Rechteckige Arena, spiegelnd entlang Mittelachse.
- Je Seite 1 High-Ground-Plattform + 2 Mid-Cover + 1 Tunnelroute.
- Zwei Spawnpunkte diagonal versetzt, ohne direkte LoS.
- Vier Power-Up Spawnpunkte (je Buff-Typ optional rotiert).

## Spawn-Regeln
- Kein Respawn innerhalb von 8m zum Gegner.
- Spawn Protection 2 Sekunden oder bis erster Schuss.
- Respawn nach 3 Sekunden.

## Power-Up Regeln
- Damage Boost: +20% Schaden, 8s, Respawn 20s
- Shield Boost: +40 Schild sofort, Respawn 25s
- Speed Boost: +15% MoveSpeed, 6s, Respawn 18s
- Instant Reload: sofortiges Nachladen, Respawn 15s

## Mobile Performance
- Max 2 dynamic lights gleichzeitig
- Partikelbudget: <= 300 alive
- Projectile Pool vorwärmen (min. 32 Instanzen)
- Ziel: 60 FPS, GPU Frame < 14ms
