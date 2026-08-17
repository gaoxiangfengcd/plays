using UnityEngine;

public class CameraOrbitController : MonoBehaviour
{
    [SerializeField] private Transform target;
    [SerializeField] private float distance = 7.5f;
    [SerializeField] private float height = 4.4f;
    [SerializeField] private float orbitSpeed = 80f;
    [SerializeField] private float zoomSpeed = 4f;

    private float yaw = 28f;

    private void LateUpdate()
    {
        if (Input.GetMouseButton(1))
        {
            yaw += Input.GetAxis("Mouse X") * orbitSpeed * Time.deltaTime;
        }

        distance = Mathf.Clamp(distance - Input.mouseScrollDelta.y * zoomSpeed * Time.deltaTime, 4.8f, 10.5f);
        Quaternion rotation = Quaternion.Euler(56f, yaw, 0f);
        Vector3 focus = target ? target.position : Vector3.zero;
        transform.position = focus + rotation * new Vector3(0f, height, -distance);
        transform.LookAt(focus);
    }
}
