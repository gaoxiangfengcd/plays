using UnityEngine;
using UnityEngine.UI;

public class CarpetHudController : MonoBehaviour
{
    [SerializeField] private Text levelText;
    [SerializeField] private Text titleText;
    [SerializeField] private Text progressText;
    [SerializeField] private Text timerText;
    [SerializeField] private Text coinsText;
    [SerializeField] private Image progressFill;
    [SerializeField] private GameObject resultPanel;
    [SerializeField] private Text resultTitle;
    [SerializeField] private Text resultMeta;

    public void ShowLevel(int level, string title)
    {
        if (resultPanel) resultPanel.SetActive(false);
        if (levelText) levelText.text = $"LEVEL {level}";
        if (titleText) titleText.text = title;
    }

    public void SetProgress(float progress, float timeLeft, int coins, int level, string title)
    {
        if (levelText) levelText.text = $"LEVEL {level}";
        if (titleText) titleText.text = title;
        if (progressText) progressText.text = $"{Mathf.RoundToInt(progress)}% CLEAN";
        if (progressFill) progressFill.fillAmount = Mathf.Clamp01(progress / 100f);
        if (timerText) timerText.text = $"{Mathf.FloorToInt(timeLeft / 60f):00}:{Mathf.FloorToInt(timeLeft % 60f):00}";
        if (coinsText) coinsText.text = $"${coins}";
    }

    public void ShowResult(int stars, int reward, float elapsed)
    {
        if (!resultPanel) return;
        resultPanel.SetActive(true);
        if (resultTitle) resultTitle.text = $"{new string('★', stars)} CLEAN COMPLETE";
        if (resultMeta) resultMeta.text = $"Reward +${reward} · Time {Mathf.FloorToInt(elapsed / 60f):00}:{Mathf.FloorToInt(elapsed % 60f):00}";
    }
}
