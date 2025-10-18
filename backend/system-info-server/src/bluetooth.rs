use serde::Serialize;

#[derive(Serialize)]
pub struct BluetoothDevice {
    pub name: Option<String>,
    pub address: String,
    pub paired: bool,
    pub connected: bool,
}

#[derive(Serialize)]
pub struct BluetoothInfo {
    pub power: bool,
    pub discoverable: bool,
    pub connectable: bool,
    pub scanning: bool,
    pub devices: Vec<BluetoothDevice>,
}

pub async fn get_bluetooth_info() -> BluetoothInfo {
    #[cfg(target_os = "macos")]
    {
        use tokio::process::Command;

        let output = Command::new("system_profiler")
            .args(["SPBluetoothDataType", "-json"])
            .output()
            .await;

        match output {
            Ok(o) if o.status.success() => {
                let s = String::from_utf8_lossy(&o.stdout);
                let json: serde_json::Value = serde_json::from_str(&s).unwrap_or_default();
                let mut bluetooth_info = BluetoothInfo {
                    power: false,
                    discoverable: false,
                    connectable: false,
                    scanning: false,
                    devices: vec![],
                };

                if let Some(bt_data) = json.get("SPBluetoothDataType").and_then(|arr| arr.get(0)) {
                    if let Some(controller) = bt_data.get("local_device") {
                        if let Some(props) = controller.get("controller_properties") {
                            bluetooth_info.power = props
                                .get("controller_state")
                                .and_then(|v| v.as_str())
                                .map(|s| s == "On")
                                .unwrap_or(false);
                            bluetooth_info.discoverable = props
                                .get("controller_discoverable")
                                .and_then(|v| v.as_str())
                                .map(|s| s == "Yes")
                                .unwrap_or(false);
                            bluetooth_info.connectable = props
                                .get("controller_connectable")
                                .and_then(|v| v.as_str())
                                .map(|s| s == "Yes")
                                .unwrap_or(false);
                            bluetooth_info.scanning = props
                                .get("controller_scanning")
                                .and_then(|v| v.as_str())
                                .map(|s| s == "Yes")
                                .unwrap_or(false);
                        }
                    }
                    if let Some(devices) = bt_data.get("device_title") {
                        if let Some(device_list) = devices.as_array() {
                            for device in device_list {
                                if let Some(device_obj) = device.as_object() {
                                    for (name, props) in device_obj {
                                        if let Some(props) = props.as_object() {
                                            bluetooth_info.devices.push(BluetoothDevice {
                                                name: Some(name.clone()),
                                                address: props
                                                    .get("device_address")
                                                    .and_then(|v| v.as_str())
                                                    .map(|s| s.to_string())
                                                    .unwrap_or_default(),
                                                paired: props
                                                    .get("device_paired")
                                                    .and_then(|v| v.as_str())
                                                    .map(|s| s == "Yes")
                                                    .unwrap_or(false),
                                                connected: props
                                                    .get("device_connected")
                                                    .and_then(|v| v.as_str())
                                                    .map(|s| s == "Yes")
                                                    .unwrap_or(false),
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                bluetooth_info
            }
            _ => {
                eprintln!("system_profiler SPBluetoothDataType failed");
                BluetoothInfo {
                    power: false,
                    discoverable: false,
                    connectable: false,
                    scanning: false,
                    devices: vec![],
                }
            }
        }
    }

    #[cfg(not(target_os = "macos"))]
    {
        BluetoothInfo {
            power: false,
            discoverable: false,
            connectable: false,
            scanning: false,
            devices: vec![],
        }
    }
}
