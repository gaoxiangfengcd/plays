Shader "PlayPicks/CarpetDirt"
{
    Properties
    {
        _BaseColor ("Base Color", Color) = (1, 0.6, 0.35, 1)
        _BaseMap ("Clean Pattern", 2D) = "white" {}
        _DirtMask ("Dirt Mask", 2D) = "black" {}
        _DirtColor ("Dirt Color", Color) = (0.18, 0.12, 0.07, 1)
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            sampler2D _BaseMap;
            sampler2D _DirtMask;
            fixed4 _BaseColor;
            fixed4 _DirtColor;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 pattern = tex2D(_BaseMap, i.uv) * _BaseColor;
                fixed dirt = tex2D(_DirtMask, i.uv).a;
                fixed fiber = sin((i.uv.x + i.uv.y * 0.25) * 180.0) * 0.035;
                fixed4 clean = pattern + fiber;
                return lerp(clean, _DirtColor, saturate(dirt));
            }
            ENDCG
        }
    }
}
