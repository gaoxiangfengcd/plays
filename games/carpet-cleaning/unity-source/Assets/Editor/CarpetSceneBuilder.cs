using System.IO;
using UnityEditor;
using UnityEditor.Events;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public static class CarpetSceneBuilder
{
    [MenuItem("Play Picks/Create Carpet Cleaning Scene")]
    public static void CreateScene()
    {
        EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

        RenderSettings.ambientLight = new Color(0.72f, 0.76f, 0.82f);
        RenderSettings.fog = true;
        RenderSettings.fogColor = new Color(0.78f, 0.86f, 0.94f);
        RenderSettings.fogDensity = 0.012f;

        GameObject light = new GameObject("Key Light");
        var sun = light.AddComponent<Light>();
        sun.type = LightType.Directional;
        sun.intensity = 1.35f;
        sun.color = new Color(1f, 0.94f, 0.82f);
        light.transform.rotation = Quaternion.Euler(48f, -32f, 0f);

        GameObject fill = new GameObject("Soft Fill Light");
        var fillLight = fill.AddComponent<Light>();
        fillLight.type = LightType.Point;
        fillLight.intensity = 1.8f;
        fillLight.range = 12f;
        fillLight.color = new Color(0.42f, 0.76f, 1f);
        fill.transform.position = new Vector3(-3f, 4f, -4f);

        GameObject cameraObject = new GameObject("Main Camera");
        var camera = cameraObject.AddComponent<Camera>();
        camera.clearFlags = CameraClearFlags.SolidColor;
        camera.backgroundColor = new Color(0.72f, 0.84f, 0.95f);
        camera.fieldOfView = 46f;
        camera.transform.position = new Vector3(0f, 5.6f, -7.4f);
        camera.transform.LookAt(Vector3.zero);
        cameraObject.tag = "MainCamera";

        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Cube);
        floor.name = "Cleaning Studio Floor";
        floor.transform.position = new Vector3(0f, -0.08f, 0f);
        floor.transform.localScale = new Vector3(10f, 0.12f, 7f);
        var floorMaterial = new Material(Shader.Find("Standard"));
        floorMaterial.color = new Color(0.86f, 0.9f, 0.93f);
        floor.GetComponent<Renderer>().sharedMaterial = floorMaterial;

        GameObject carpet = GameObject.CreatePrimitive(PrimitiveType.Plane);
        carpet.name = "CarpetSurface";
        carpet.transform.position = new Vector3(0f, 0.01f, 0f);
        var material = new Material(Shader.Find("PlayPicks/CarpetDirt"));
        carpet.GetComponent<Renderer>().sharedMaterial = material;
        var surface = carpet.AddComponent<CarpetSurface>();

        GameObject tool = GameObject.CreatePrimitive(PrimitiveType.Capsule);
        tool.name = "CleanerTool";
        tool.transform.localScale = new Vector3(0.32f, 0.42f, 0.32f);
        var toolMaterial = new Material(Shader.Find("Standard"));
        toolMaterial.color = new Color(1f, 0.86f, 0.22f);
        tool.GetComponent<Renderer>().sharedMaterial = toolMaterial;
        var toolController = tool.AddComponent<CleanerToolController>();

        var foam = CreateParticles("Foam Burst", tool.transform, new Color(0.92f, 0.98f, 1f), 0.12f, 42);
        var water = CreateParticles("Water Spray", tool.transform, new Color(0.2f, 0.75f, 1f), 0.08f, 65);
        var sparkle = CreateParticles("Brush Sparkles", tool.transform, new Color(1f, 0.9f, 0.28f), 0.055f, 32);

        GameObject rig = new GameObject("CameraRig");
        var orbit = rig.AddComponent<CameraOrbitController>();
        cameraObject.transform.SetParent(rig.transform, true);

        GameObject uiRoot = new GameObject("UIRoot");
        var canvas = uiRoot.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        var scaler = uiRoot.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1440f, 900f);
        uiRoot.AddComponent<GraphicRaycaster>();
        var hud = uiRoot.AddComponent<CarpetHudController>();

        GameObject managerObject = new GameObject("GameRoot");
        var manager = managerObject.AddComponent<CarpetGameManager>();

        BuildHud(uiRoot.transform, hud, manager);

        var toolSo = new SerializedObject(toolController);
        toolSo.FindProperty("mainCamera").objectReferenceValue = camera;
        toolSo.FindProperty("carpetSurface").objectReferenceValue = surface;
        toolSo.FindProperty("foamParticles").objectReferenceValue = foam;
        toolSo.FindProperty("waterParticles").objectReferenceValue = water;
        toolSo.FindProperty("sparkleParticles").objectReferenceValue = sparkle;
        toolSo.FindProperty("carpetLayer").intValue = ~0;
        toolSo.ApplyModifiedPropertiesWithoutUndo();

        var orbitSo = new SerializedObject(orbit);
        orbitSo.FindProperty("target").objectReferenceValue = carpet.transform;
        orbitSo.ApplyModifiedPropertiesWithoutUndo();

        var managerSo = new SerializedObject(manager);
        managerSo.FindProperty("carpetSurface").objectReferenceValue = surface;
        managerSo.FindProperty("toolController").objectReferenceValue = toolController;
        managerSo.FindProperty("hud").objectReferenceValue = hud;
        managerSo.ApplyModifiedPropertiesWithoutUndo();

        Directory.CreateDirectory("Assets/Scenes");
        EditorSceneManager.SaveScene(EditorSceneManager.GetActiveScene(), "Assets/Scenes/CarpetCleaningGame.unity");
        AssetDatabase.SaveAssets();
        Debug.Log("Created Assets/Scenes/CarpetCleaningGame.unity");
    }

    private static ParticleSystem CreateParticles(string name, Transform parent, Color color, float size, int rate)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent, false);
        obj.transform.localPosition = new Vector3(0f, -0.65f, 0f);
        var particles = obj.AddComponent<ParticleSystem>();
        var main = particles.main;
        main.startColor = color;
        main.startSize = size;
        main.startLifetime = 0.45f;
        main.startSpeed = 1.2f;
        main.simulationSpace = ParticleSystemSimulationSpace.World;
        var emission = particles.emission;
        emission.rateOverTime = rate;
        var shape = particles.shape;
        shape.shapeType = ParticleSystemShapeType.Cone;
        shape.angle = 28f;
        particles.Stop();
        return particles;
    }

    private static void BuildHud(Transform root, CarpetHudController hud, CarpetGameManager manager)
    {
        var topBar = CreatePanel("TopBar", root, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -22f), new Vector2(1260f, 86f), new Color(0.04f, 0.08f, 0.13f, 0.78f));
        var levelText = CreateText("LevelText", topBar.transform, "LEVEL 1", 22, FontStyle.Bold, TextAnchor.MiddleLeft, new Vector2(28f, -10f), new Vector2(180f, 44f));
        var titleText = CreateText("TitleText", topBar.transform, "Cozy Bedroom Rug", 30, FontStyle.Bold, TextAnchor.MiddleLeft, new Vector2(190f, -10f), new Vector2(420f, 44f));
        var timerText = CreateText("TimerText", topBar.transform, "02:00", 30, FontStyle.Bold, TextAnchor.MiddleCenter, new Vector2(520f, -10f), new Vector2(180f, 44f));
        var coinsText = CreateText("CoinsText", topBar.transform, "$250", 28, FontStyle.Bold, TextAnchor.MiddleRight, new Vector2(850f, -10f), new Vector2(190f, 44f));
        var progressText = CreateText("ProgressText", topBar.transform, "0% CLEAN", 22, FontStyle.Bold, TextAnchor.MiddleRight, new Vector2(1030f, -10f), new Vector2(180f, 44f));
        var progressBack = CreatePanel("ProgressBack", topBar.transform, new Vector2(0f, 0f), new Vector2(0f, 0f), new Vector2(28f, 14f), new Vector2(1200f, 12f), new Color(1f, 1f, 1f, 0.16f));
        var progressFill = CreatePanel("ProgressFill", progressBack.transform, new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), Vector2.zero, new Vector2(1200f, 12f), new Color(0.14f, 0.86f, 0.58f, 1f)).GetComponent<Image>();
        progressFill.type = Image.Type.Filled;
        progressFill.fillMethod = Image.FillMethod.Horizontal;
        progressFill.fillOrigin = 0;
        progressFill.fillAmount = 0f;

        var tools = CreatePanel("ToolDock", root, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 36f), new Vector2(760f, 82f), new Color(0.04f, 0.08f, 0.13f, 0.76f));
        CreateButton("FoamButton", tools.transform, "FOAM", new Vector2(-245f, 0f), new Vector2(190f, 56f), new Color(0.2f, 0.72f, 1f), manager.SetFoamTool);
        CreateButton("WaterButton", tools.transform, "WATER", new Vector2(0f, 0f), new Vector2(190f, 56f), new Color(0.08f, 0.82f, 0.68f), manager.SetWaterTool);
        CreateButton("BrushButton", tools.transform, "BRUSH", new Vector2(245f, 0f), new Vector2(190f, 56f), new Color(1f, 0.74f, 0.18f), manager.SetBrushTool);

        var result = CreatePanel("ResultPanel", root, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(520f, 250f), new Color(0.04f, 0.08f, 0.13f, 0.9f));
        var resultTitle = CreateText("ResultTitle", result.transform, "CLEAN COMPLETE", 34, FontStyle.Bold, TextAnchor.MiddleCenter, new Vector2(0f, 62f), new Vector2(460f, 58f));
        var resultMeta = CreateText("ResultMeta", result.transform, "Reward +$50", 22, FontStyle.Normal, TextAnchor.MiddleCenter, new Vector2(0f, 6f), new Vector2(460f, 44f));
        CreateButton("NextLevelButton", result.transform, "NEXT LEVEL", new Vector2(0f, -72f), new Vector2(230f, 58f), new Color(0.12f, 0.84f, 0.56f), manager.NextLevel);
        result.SetActive(false);

        var hudSo = new SerializedObject(hud);
        hudSo.FindProperty("levelText").objectReferenceValue = levelText;
        hudSo.FindProperty("titleText").objectReferenceValue = titleText;
        hudSo.FindProperty("progressText").objectReferenceValue = progressText;
        hudSo.FindProperty("timerText").objectReferenceValue = timerText;
        hudSo.FindProperty("coinsText").objectReferenceValue = coinsText;
        hudSo.FindProperty("progressFill").objectReferenceValue = progressFill;
        hudSo.FindProperty("resultPanel").objectReferenceValue = result;
        hudSo.FindProperty("resultTitle").objectReferenceValue = resultTitle;
        hudSo.FindProperty("resultMeta").objectReferenceValue = resultMeta;
        hudSo.ApplyModifiedPropertiesWithoutUndo();
    }

    private static GameObject CreatePanel(string name, Transform parent, Vector2 anchorMin, Vector2 anchorMax, Vector2 anchoredPosition, Vector2 size, Color color)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent, false);
        var rect = obj.AddComponent<RectTransform>();
        rect.anchorMin = anchorMin;
        rect.anchorMax = anchorMax;
        rect.anchoredPosition = anchoredPosition;
        rect.sizeDelta = size;
        var image = obj.AddComponent<Image>();
        image.color = color;
        return obj;
    }

    private static Text CreateText(string name, Transform parent, string text, int size, FontStyle style, TextAnchor align, Vector2 pos, Vector2 box)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent, false);
        var rect = obj.AddComponent<RectTransform>();
        rect.anchorMin = new Vector2(0.5f, 0.5f);
        rect.anchorMax = new Vector2(0.5f, 0.5f);
        rect.anchoredPosition = pos;
        rect.sizeDelta = box;
        var label = obj.AddComponent<Text>();
        label.text = text;
        label.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        label.fontSize = size;
        label.fontStyle = style;
        label.alignment = align;
        label.color = Color.white;
        label.resizeTextForBestFit = true;
        label.resizeTextMinSize = 12;
        label.resizeTextMaxSize = size;
        return label;
    }

    private static Button CreateButton(string name, Transform parent, string label, Vector2 pos, Vector2 box, Color color, UnityAction action)
    {
        GameObject obj = CreatePanel(name, parent, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), pos, box, color);
        var button = obj.AddComponent<Button>();
        var colors = button.colors;
        colors.normalColor = color;
        colors.highlightedColor = Color.Lerp(color, Color.white, 0.18f);
        colors.pressedColor = Color.Lerp(color, Color.black, 0.18f);
        button.colors = colors;
        UnityEventTools.AddPersistentListener(button.onClick, action);
        CreateText(name + "Label", obj.transform, label, 21, FontStyle.Bold, TextAnchor.MiddleCenter, Vector2.zero, box);
        return button;
    }
}
