using UnityEngine;

public enum CleanerToolType
{
    Foam,
    Water,
    Brush
}

public class CleanerToolController : MonoBehaviour
{
    [SerializeField] private Camera mainCamera;
    [SerializeField] private CarpetSurface carpetSurface;
    [SerializeField] private ParticleSystem foamParticles;
    [SerializeField] private ParticleSystem waterParticles;
    [SerializeField] private ParticleSystem sparkleParticles;
    [SerializeField] private LayerMask carpetLayer;

    public CleanerToolType CurrentTool { get; private set; } = CleanerToolType.Water;

    private float Radius => CurrentTool == CleanerToolType.Brush ? 0.045f : CurrentTool == CleanerToolType.Foam ? 0.07f : 0.09f;
    private float Strength => CurrentTool == CleanerToolType.Brush ? 0.032f : CurrentTool == CleanerToolType.Foam ? 0.018f : 0.026f;

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1)) SetTool(CleanerToolType.Foam);
        if (Input.GetKeyDown(KeyCode.Alpha2)) SetTool(CleanerToolType.Water);
        if (Input.GetKeyDown(KeyCode.Alpha3)) SetTool(CleanerToolType.Brush);

        bool active = Input.GetMouseButton(0) || Input.touchCount > 0;
        UpdateParticles(active);
        if (!active) return;

        Vector2 screenPos = Input.touchCount > 0 ? Input.GetTouch(0).position : (Vector2)Input.mousePosition;
        Ray ray = mainCamera.ScreenPointToRay(screenPos);
        if (!Physics.Raycast(ray, out RaycastHit hit, 100f, carpetLayer)) return;

        transform.position = hit.point + Vector3.up * 0.65f;
        transform.rotation = Quaternion.LookRotation(Vector3.down + mainCamera.transform.forward * 0.2f);
        carpetSurface.CleanAt(hit.textureCoord, CurrentTool, Radius, Strength);
    }

    public void SetTool(CleanerToolType tool)
    {
        CurrentTool = tool;
    }

    private void UpdateParticles(bool active)
    {
        SetParticle(foamParticles, active && CurrentTool == CleanerToolType.Foam);
        SetParticle(waterParticles, active && CurrentTool == CleanerToolType.Water);
        SetParticle(sparkleParticles, active && CurrentTool == CleanerToolType.Brush);
    }

    private static void SetParticle(ParticleSystem particles, bool shouldPlay)
    {
        if (!particles) return;
        if (shouldPlay && !particles.isPlaying) particles.Play();
        if (!shouldPlay && particles.isPlaying) particles.Stop();
    }
}
