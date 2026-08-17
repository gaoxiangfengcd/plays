using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;

public static class CarpetWebGLBuilder
{
    public static void BuildWebGL()
    {
        CarpetSceneBuilder.CreateScene();

        const string scenePath = "Assets/Scenes/CarpetCleaningGame.unity";
        string outputPath = Path.GetFullPath("../unity-build");
        Directory.CreateDirectory(outputPath);

        EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.WebGL, BuildTarget.WebGL);
        PlayerSettings.companyName = "Play Picks";
        PlayerSettings.productName = "Carpet Cleaning";
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
        PlayerSettings.WebGL.template = "APPLICATION:Default";

        var options = new BuildPlayerOptions
        {
            scenes = new[] { scenePath },
            locationPathName = outputPath,
            target = BuildTarget.WebGL,
            options = BuildOptions.None
        };

        BuildReport report = BuildPipeline.BuildPlayer(options);
        if (report.summary.result != BuildResult.Succeeded)
        {
            throw new BuildFailedException($"WebGL build failed: {report.summary.result}");
        }

        UnityEngine.Debug.Log($"WebGL build complete: {outputPath}");
    }
}
