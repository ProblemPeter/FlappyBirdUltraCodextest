# Unity 2022+ 3D 1v1 Online Multiplayer Shooter (Android/iOS) – Grundgerüst

Dieses Grundgerüst liefert eine **mobile-optimierte, modulare Basis** für einen First-Person 1v1 Arena Shooter mit **Photon Fusion** (Host/Shared Mode).

## Features im Scaffold
- 1v1 Matchmaking (Ranked / Casual / Custom Room)
- NetworkRunner Bootstrap + Session-Flow
- Server-autoritative Trefferlogik mit Client-Prediction Hooks
- Touch Input (Joystick + Swipe + Action Buttons)
- Modulares Waffen-System per ScriptableObject
- Projektil-Object-Pooling
- Health/Shield/Respawn/Spawn-Protection
- Power-Up Spawn & Respawn Timer
- Match Manager (Best-of-5 oder Kill-Limit)
- UI Manager (HP, Ammo, Timer, Score, Ping, Endscreen)
- Elo-Rating, XP/Level, Cosmetics (Skins) Datenmodell

---

## Ordnerstruktur (Unity)
```text
Assets/
  Scripts/
    Core/
    Network/
    Input/
    Player/
    Combat/
    Weapons/
    Gameplay/
    UI/
    Data/
    Pooling/
    Systems/
  ScriptableObjects/
    Weapons/
    PowerUps/
  Prefabs/
  Scenes/
  Audio/
  Art/
```

## Schnellstart (Unity)
1. Neues Unity 2022 LTS Projekt erstellen (URP empfohlen).
2. Photon Fusion SDK importieren.
3. Inhalte aus `UnityMultiplayerShooter/Assets` in dein Unity-`Assets` Verzeichnis kopieren.
4. Szene `MainMenu` und `Arena_1v1` anlegen.
5. `NetworkBootstrap` in `MainMenu` platzieren.
6. `MatchConfig` und Waffen-ScriptableObjects erzeugen.
7. UI-Canvas mit Touch-Zonen und Buttons an `MobileInputController` anbinden.
8. Player-Prefab mit `NetworkObject`, `NetworkCharacterControllerPrototype`, `NetworkPlayerController`, `HealthComponent`, `WeaponController` konfigurieren.

## Architektur-Highlights
- **Server Authority**: Schadensberechnung/Hit Validation nur auf State Authority.
- **Prediction & Reconciliation**: Fusion Input/Simulation Hooks vorbereitet.
- **Lag Compensation**: Beispiel mit `Runner.LagCompensation.Raycast` enthalten.
- **Cheat-Schutz**: Client sendet nur Input-Intentionen, keine direkten Damage-Werte.
- **Keine Double-Hits**: Schuss-Ticks + serverseitige Fire-Gate Logik.

## Skalierung auf 2v2 / 4v4
- `MatchManager` um Teamstruktur erweitern (`TeamId`, Team-Spawnpunkte, Team-Score).
- Matchmaking um `MaxPlayers` und Team-Balance ergänzen.
- HUD um Team-Status-Widget erweitern.
- Relevancy/Interest Management und Snapshot Compression aggressiver konfigurieren.
- AI Bots optional als Fallback für Matchfill.

## Performance-Ziele (Mobile)
- 60 FPS auf Midrange-Geräten
- Projectiles, Hit FX, Damage Numbers via Pooling
- Reduzierte Fixed-Tickrate + Interpolation
- LOD Groups + Occlusion + komprimierte Texturen (ASTC)
- Audio Voice Limits + Event-basierte Wiedergabe

> Hinweis: Dies ist ein **produktionsnahes Skeleton**. Für ein Shipping-Spiel sind Balancing, Security Hardening, QA und Content-Pipeline noch zu ergänzen.
