# Carpet Cleaning Unity3D Source

This folder contains the Unity WebGL source plan and scripts for the Play Picks Carpet Cleaning game.

Unity is not installed on this Mac, so the WebGL build files are not generated here. Open this folder as a Unity project, run `Play Picks > Create Carpet Cleaning Scene`, then export WebGL to:

`games/carpet-cleaning/unity-build/`

The website page is designed to load:

- `unity-build/Build/CarpetCleaning.loader.js`
- `unity-build/Build/CarpetCleaning.data.unityweb`
- `unity-build/Build/CarpetCleaning.framework.js.unityweb`
- `unity-build/Build/CarpetCleaning.wasm.unityweb`

## Game Design

- Theme: satisfying 3D carpet cleaning with bright toy-like visuals.
- Core loop: pick a dirty carpet, spray foam, scrub, rinse, reveal clean pattern.
- Levels: progressively larger carpets, tougher stains, more tools, stricter timers.
- Rewards: coins, stars, unlockable carpet patterns and nozzle upgrades.

## Levels

1. Cozy Bedroom Rug - small carpet, dust and light mud.
2. Family Room Carpet - larger surface, drink stains and muddy footprints.
3. Pet Mess Runner - long carpet, fur clumps and sticky patches.
4. Luxury Pattern Rug - ornate carpet, precision cleaning.
5. Disaster Carpet - heavy grime, all tools required, bonus sparkle finish.

## Unity Scene Setup

Create one scene named `CarpetCleaningGame`.

Required objects:

- `GameRoot` with `CarpetGameManager`
- `CarpetSurface` plane with collider and `CarpetSurface`
- `CleanerTool` with `CleanerToolController`
- `CameraRig` with `CameraOrbitController`
- `UIRoot` canvas with `CarpetHudController`

Use URP if available, otherwise Built-in pipeline is fine for WebGL.

## No-code export path

1. Install Unity Hub.
2. Install Unity 2022.3 LTS with the WebGL Build Support module.
3. Open this `unity-source` folder as a Unity project.
4. In Unity, click `Play Picks > Create Carpet Cleaning Scene`.
5. Open `File > Build Settings`, choose `WebGL`, click `Switch Platform`.
6. Build to `../unity-build`.
