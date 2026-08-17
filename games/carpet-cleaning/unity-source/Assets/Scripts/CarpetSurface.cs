using UnityEngine;

[RequireComponent(typeof(Renderer))]
public class CarpetSurface : MonoBehaviour
{
    [SerializeField] private int textureSize = 1024;
    [SerializeField] private Texture2D cleanPattern;
    [SerializeField] private Color dirtColor = new Color(0.2f, 0.14f, 0.08f, 1f);

    private Texture2D dirtMask;
    private Color[] pixels;
    private float[] dirt;
    private Renderer carpetRenderer;
    private int totalDirtyPixels;

    public float CleanPercent { get; private set; }

    private void Awake()
    {
        carpetRenderer = GetComponent<Renderer>();
    }

    public void BuildLevel(CarpetLevelData level)
    {
        transform.localScale = new Vector3(level.carpetSize.x, 1f, level.carpetSize.y);

        dirtMask = new Texture2D(textureSize, textureSize, TextureFormat.RGBA32, false);
        dirtMask.wrapMode = TextureWrapMode.Clamp;
        pixels = new Color[textureSize * textureSize];
        dirt = new float[pixels.Length];
        totalDirtyPixels = 0;

        for (int y = 0; y < textureSize; y++)
        {
            for (int x = 0; x < textureSize; x++)
            {
                int i = y * textureSize + x;
                float wave = Mathf.PerlinNoise(x * 0.015f, y * 0.015f);
                float stain = Mathf.PerlinNoise((x + 200f) * 0.038f, (y - 80f) * 0.038f);
                float footprint = Mathf.Sin((x + y) * 0.035f) * 0.5f + 0.5f;
                float amount = Mathf.Clamp01((wave * 0.6f + stain * 0.55f + footprint * 0.15f) * level.dirtDensity);
                if (amount > 0.18f) totalDirtyPixels++;
                dirt[i] = amount;
                pixels[i] = Color.Lerp(Color.clear, dirtColor, amount);
            }
        }

        dirtMask.SetPixels(pixels);
        dirtMask.Apply(false);

        Material material = carpetRenderer.material;
        material.SetColor("_BaseColor", level.baseColor);
        material.SetTexture("_BaseMap", cleanPattern);
        material.SetTexture("_DirtMask", dirtMask);
        CleanPercent = 0f;
    }

    public void CleanAt(Vector2 uv, CleanerToolType toolType, float radius, float strength)
    {
        int cx = Mathf.RoundToInt(uv.x * textureSize);
        int cy = Mathf.RoundToInt(uv.y * textureSize);
        int r = Mathf.RoundToInt(radius * textureSize);
        float toolMultiplier = toolType == CleanerToolType.Brush ? 1.25f : toolType == CleanerToolType.Foam ? 0.75f : 1f;

        for (int y = cy - r; y <= cy + r; y++)
        {
            if (y < 0 || y >= textureSize) continue;
            for (int x = cx - r; x <= cx + r; x++)
            {
                if (x < 0 || x >= textureSize) continue;
                float dist = Vector2.Distance(new Vector2(x, y), new Vector2(cx, cy)) / Mathf.Max(1, r);
                if (dist > 1f) continue;

                int i = y * textureSize + x;
                float falloff = 1f - dist;
                float foamBonus = toolType == CleanerToolType.Foam && dirt[i] > 0.55f ? 0.12f : 0f;
                dirt[i] = Mathf.Max(0f, dirt[i] - (strength * toolMultiplier + foamBonus) * falloff);
                pixels[i] = Color.Lerp(Color.clear, dirtColor, dirt[i]);
            }
        }

        dirtMask.SetPixels(pixels);
        dirtMask.Apply(false);
        RecalculateProgress();
    }

    private void RecalculateProgress()
    {
        int remaining = 0;
        for (int i = 0; i < dirt.Length; i++)
        {
            if (dirt[i] > 0.18f) remaining++;
        }

        if (totalDirtyPixels <= 0)
        {
            CleanPercent = 100f;
            return;
        }

        CleanPercent = Mathf.Clamp01(1f - remaining / (float)totalDirtyPixels) * 100f;
    }
}
