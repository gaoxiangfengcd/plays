using System;
using UnityEngine;

[Serializable]
public class CarpetLevelData
{
    public string levelName;
    public string displayName;
    public int rewardCoins = 50;
    public float timeLimitSeconds = 120f;
    [Range(0.1f, 1f)] public float dirtDensity = 0.35f;
    [Range(0.1f, 1f)] public float stainToughness = 0.45f;
    public Vector2 carpetSize = new Vector2(5.5f, 3.4f);
    public Color baseColor = new Color(0.9f, 0.45f, 0.3f);
    public Color patternColor = new Color(0.2f, 0.75f, 0.65f);

    public static CarpetLevelData[] CreateDefaults()
    {
        return new[]
        {
            new CarpetLevelData
            {
                levelName = "level_01",
                displayName = "Cozy Bedroom Rug",
                rewardCoins = 50,
                timeLimitSeconds = 120f,
                dirtDensity = 0.28f,
                stainToughness = 0.35f,
                carpetSize = new Vector2(4.8f, 3.0f),
                baseColor = new Color(0.95f, 0.55f, 0.38f),
                patternColor = new Color(0.25f, 0.82f, 0.7f)
            },
            new CarpetLevelData
            {
                levelName = "level_02",
                displayName = "Family Room Carpet",
                rewardCoins = 100,
                timeLimitSeconds = 150f,
                dirtDensity = 0.45f,
                stainToughness = 0.5f,
                carpetSize = new Vector2(5.8f, 3.6f),
                baseColor = new Color(0.35f, 0.62f, 0.95f),
                patternColor = new Color(1f, 0.78f, 0.28f)
            },
            new CarpetLevelData
            {
                levelName = "level_03",
                displayName = "Pet Mess Runner",
                rewardCoins = 160,
                timeLimitSeconds = 170f,
                dirtDensity = 0.58f,
                stainToughness = 0.62f,
                carpetSize = new Vector2(6.4f, 3.2f),
                baseColor = new Color(0.63f, 0.48f, 0.95f),
                patternColor = new Color(0.95f, 0.95f, 0.98f)
            },
            new CarpetLevelData
            {
                levelName = "level_04",
                displayName = "Luxury Pattern Rug",
                rewardCoins = 230,
                timeLimitSeconds = 190f,
                dirtDensity = 0.7f,
                stainToughness = 0.72f,
                carpetSize = new Vector2(6.8f, 4.0f),
                baseColor = new Color(0.9f, 0.25f, 0.38f),
                patternColor = new Color(0.12f, 0.18f, 0.32f)
            },
            new CarpetLevelData
            {
                levelName = "level_05",
                displayName = "Disaster Carpet",
                rewardCoins = 350,
                timeLimitSeconds = 220f,
                dirtDensity = 0.86f,
                stainToughness = 0.9f,
                carpetSize = new Vector2(7.2f, 4.2f),
                baseColor = new Color(0.12f, 0.72f, 0.56f),
                patternColor = new Color(1f, 0.86f, 0.25f)
            }
        };
    }
}
