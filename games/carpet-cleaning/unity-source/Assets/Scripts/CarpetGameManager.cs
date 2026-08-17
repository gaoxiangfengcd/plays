using UnityEngine;

public class CarpetGameManager : MonoBehaviour
{
    [SerializeField] private CarpetSurface carpetSurface;
    [SerializeField] private CleanerToolController toolController;
    [SerializeField] private CarpetHudController hud;

    private CarpetLevelData[] levels;
    private int levelIndex;
    private float startedAt;
    private bool completed;
    private int coins = 250;

    private void Start()
    {
        levels = CarpetLevelData.CreateDefaults();
        StartLevel(0);
    }

    private void Update()
    {
        if (completed) return;

        CarpetLevelData level = levels[levelIndex];
        float elapsed = Time.time - startedAt;
        float timeLeft = Mathf.Max(0f, level.timeLimitSeconds - elapsed);
        hud.SetProgress(carpetSurface.CleanPercent, timeLeft, coins, levelIndex + 1, level.displayName);

        if (carpetSurface.CleanPercent >= 99.5f)
        {
            CompleteLevel(elapsed);
        }
    }

    public void StartLevel(int index)
    {
        levelIndex = Mathf.Clamp(index, 0, levels.Length - 1);
        completed = false;
        startedAt = Time.time;
        carpetSurface.BuildLevel(levels[levelIndex]);
        hud.ShowLevel(levelIndex + 1, levels[levelIndex].displayName);
    }

    public void NextLevel()
    {
        StartLevel((levelIndex + 1) % levels.Length);
    }

    public void SetFoamTool() => toolController.SetTool(CleanerToolType.Foam);
    public void SetWaterTool() => toolController.SetTool(CleanerToolType.Water);
    public void SetBrushTool() => toolController.SetTool(CleanerToolType.Brush);

    private void CompleteLevel(float elapsed)
    {
        completed = true;
        CarpetLevelData level = levels[levelIndex];
        int stars = elapsed <= level.timeLimitSeconds * 0.55f ? 3 : elapsed <= level.timeLimitSeconds * 0.8f ? 2 : 1;
        int reward = Mathf.RoundToInt(level.rewardCoins * (1f + stars * 0.18f));
        coins += reward;
        hud.ShowResult(stars, reward, elapsed);
    }
}
