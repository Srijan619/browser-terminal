use serde::Serialize;

#[derive(Serialize)]
pub struct WifiInfo {
    pub ssid: Option<String>,
    pub signal_strength: Option<i32>,
    pub is_connected: bool,
    pub bssid: Option<String>,
    pub mac_address: Option<String>,
    pub channel: Option<String>,
    pub security: Option<String>,
    pub phy_mode: Option<String>,
    pub mcs_index: Option<i32>,
    pub nss: Option<i32>,
    pub tx_rate: Option<String>,
    pub noise: Option<i32>,
    pub country_code: Option<String>,
}

pub async fn get_wifi_info() -> WifiInfo {
    #[cfg(target_os = "macos")]
    {
        use tokio::process::Command;

        let output = Command::new("sudo").args(["wdutil", "info"]).output().await;

        match output {
            Ok(o) if o.status.success() => {
                let s = String::from_utf8_lossy(&o.stdout);
                let mut wifi_info = WifiInfo {
                    ssid: None,
                    signal_strength: None,
                    is_connected: false,
                    bssid: None,
                    mac_address: None,
                    channel: None,
                    security: None,
                    phy_mode: None,
                    mcs_index: None,
                    nss: None,
                    tx_rate: None,
                    noise: None,
                    country_code: None,
                };

                for line in s.lines() {
                    if line.contains("SSID") && !line.contains("BSSID") {
                        let ssid = line.split(':').last().unwrap_or("").trim().to_string();
                        if !ssid.is_empty() && !ssid.eq("None") {
                            wifi_info.ssid = Some(ssid);
                            wifi_info.is_connected = true;
                        }
                    } else if line.contains("RSSI") {
                        if let Some(rssi_str) = line.split(':').last() {
                            if let Ok(rssi) = rssi_str.trim().replace(" dBm", "").parse::<i32>() {
                                let percentage =
                                    (((rssi + 100) as f32 * 1.4286) as i32).clamp(0, 100);
                                wifi_info.signal_strength = Some(percentage);
                            }
                        }
                    } else if line.contains("BSSID") {
                        wifi_info.bssid =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("MAC Address") {
                        wifi_info.mac_address =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("Channel") && !line.contains("Supported Channels") {
                        wifi_info.channel =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("Security") {
                        wifi_info.security =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("PHY Mode") {
                        wifi_info.phy_mode =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("MCS Index") {
                        wifi_info.mcs_index = line
                            .split(':')
                            .last()
                            .unwrap_or("")
                            .trim()
                            .parse::<i32>()
                            .ok();
                    } else if line.contains("NSS") {
                        wifi_info.nss = line
                            .split(':')
                            .last()
                            .unwrap_or("")
                            .trim()
                            .parse::<i32>()
                            .ok();
                    } else if line.contains("Tx Rate") {
                        wifi_info.tx_rate =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("Noise") {
                        wifi_info.noise = line
                            .split(':')
                            .last()
                            .unwrap_or("")
                            .trim()
                            .replace(" dBm", "")
                            .parse::<i32>()
                            .ok();
                    } else if line.contains("Country Code") {
                        wifi_info.country_code =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    }
                }

                wifi_info
            }
            Ok(o) => {
                eprintln!("wdutil command failed with status: {:?}", o.status);
                if !o.stderr.is_empty() {
                    eprintln!("wdutil stderr: {}", String::from_utf8_lossy(&o.stderr));
                }
                try_networksetup().await
            }
            Err(e) => {
                eprintln!("wdutil command failed: {:?}", e);
                try_networksetup().await
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        use tokio::process::Command;

        let status = Command::new("nmcli")
            .args([
                "-t",
                "-f",
                "GENERAL.STATE",
                "connection",
                "show",
                "--active",
            ])
            .output()
            .await
            .ok();

        let is_connected = status
            .map(|output| String::from_utf8_lossy(&output.stdout).contains("activated"))
            .unwrap_or(false);

        if is_connected {
            let output = Command::new("nmcli")
                .args([
                    "-t",
                    "-f",
                    "NAME,TYPE,SIGNAL",
                    "connection",
                    "show",
                    "--active",
                ])
                .output()
                .await
                .ok();

            if let Some(o) = output {
                let s = String::from_utf8_lossy(&o.stdout);
                for line in s.lines() {
                    if line.contains(":wifi") {
                        let parts: Vec<&str> = line.split(':').collect();
                        if parts.len() >= 3 {
                            let ssid = parts[0].to_string();
                            let signal = parts[2].parse::<i32>().ok();
                            return WifiInfo {
                                ssid: Some(ssid),
                                signal_strength: signal,
                                is_connected: true,
                                bssid: None,
                                mac_address: None,
                                channel: None,
                                security: None,
                                phy_mode: None,
                                mcs_index: None,
                                nss: None,
                                tx_rate: None,
                                noise: None,
                                country_code: None,
                            };
                        }
                    }
                }
            }
        }

        WifiInfo {
            ssid: None,
            signal_strength: None,
            is_connected: false,
            bssid: None,
            mac_address: None,
            channel: None,
            security: None,
            phy_mode: None,
            mcs_index: None,
            nss: None,
            tx_rate: None,
            noise: None,
            country_code: None,
        }
    }

    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::ERROR_SUCCESS;
        use windows::Win32::NetworkManagement::WiFi::{
            WlanCloseHandle, WlanEnumInterfaces, WlanFreeMemory, WlanGetNetworkBssList,
            WlanOpenHandle, WLAN_API_VERSION_2_0,
        };

        let mut wifi_info = WifiInfo {
            ssid: None,
            signal_strength: None,
            is_connected: false,
            bssid: None,
            mac_address: None,
            channel: None,
            security: None,
            phy_mode: None,
            mcs_index: None,
            nss: None,
            tx_rate: None,
            noise: None,
            country_code: None,
        };

        unsafe {
            let mut client_handle = std::ptr::null_mut();
            let mut version = 0;
            if WlanOpenHandle(
                WLAN_API_VERSION_2_0,
                std::ptr::null_mut(),
                &mut version,
                &mut client_handle,
            ) == ERROR_SUCCESS
            {
                let mut interface_list = std::ptr::null_mut();
                if WlanEnumInterfaces(client_handle, std::ptr::null_mut(), &mut interface_list)
                    == ERROR_SUCCESS
                {
                    let interfaces = (*interface_list)
                        .InterfaceInfo
                        .as_slice((*interface_list).dwNumberOfItems as usize);
                    if !interfaces.is_empty() {
                        let interface_guid = &interfaces[0].InterfaceGuid;
                        let mut bss_list = std::ptr::null_mut();
                        if WlanGetNetworkBssList(
                            client_handle,
                            interface_guid,
                            std::ptr::null(),
                            0,
                            false,
                            std::ptr::null_mut(),
                            &mut bss_list,
                        ) == ERROR_SUCCESS
                        {
                            let bss_entries = (*bss_list)
                                .wlanBssEntries
                                .as_slice((*bss_list).dwNumberOfItems as usize);
                            if !bss_entries.is_empty() {
                                let ssid_bytes = bss_entries[0]
                                    .dot11Ssid
                                    .SSID
                                    .as_slice(bss_entries[0].dot11Ssid.SSIDLength as usize);
                                wifi_info.ssid = String::from_utf8(ssid_bytes.to_vec()).ok();
                                wifi_info.signal_strength =
                                    Some(bss_entries[0].uLinkQuality as i32);
                                wifi_info.is_connected = true;
                            }
                            WlanFreeMemory(bss_list as _);
                        }
                    }
                    WlanFreeMemory(interface_list as _);
                }
                WlanCloseHandle(client_handle, std::ptr::null_mut());
            }
        }

        wifi_info
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        WifiInfo {
            ssid: None,
            signal_strength: None,
            is_connected: false,
            bssid: None,
            mac_address: None,
            channel: None,
            security: None,
            phy_mode: None,
            mcs_index: None,
            nss: None,
            tx_rate: None,
            noise: None,
            country_code: None,
        }
    }
}

#[cfg(target_os = "macos")]
async fn try_networksetup() -> WifiInfo {
    use tokio::process::Command;

    let interface_output = Command::new("networksetup")
        .args(["-listallhardwareports"])
        .output()
        .await;

    let wifi_interface = match interface_output {
        Ok(o) if o.status.success() => {
            let s = String::from_utf8_lossy(&o.stdout);
            let mut interface = "en0".to_string();
            for line in s.lines() {
                if line.contains("Wi-Fi") {
                    if let Some(next_line) = s.lines().skip_while(|l| !l.contains("Wi-Fi")).nth(1) {
                        if next_line.contains("Device: ") {
                            interface = next_line.replace("Device: ", "").trim().to_string();
                        }
                    }
                    break;
                }
            }
            interface
        }
        _ => {
            eprintln!("Failed to list hardware ports with networksetup");
            "en0".to_string()
        }
    };

    let output = Command::new("networksetup")
        .args(["-getairportnetwork", &wifi_interface])
        .output()
        .await;

    match output {
        Ok(o) if o.status.success() => {
            let s = String::from_utf8_lossy(&o.stdout);
            if s.contains("You are not associated with an AirPort network") {
                return WifiInfo {
                    ssid: None,
                    signal_strength: None,
                    is_connected: false,
                    bssid: None,
                    mac_address: None,
                    channel: None,
                    security: None,
                    phy_mode: None,
                    mcs_index: None,
                    nss: None,
                    tx_rate: None,
                    noise: None,
                    country_code: None,
                };
            }
            if let Some(ssid_line) = s
                .lines()
                .find(|line| line.contains("Current Wi-Fi Network: "))
            {
                let ssid = ssid_line
                    .replace("Current Wi-Fi Network: ", "")
                    .trim()
                    .to_string();
                return WifiInfo {
                    ssid: Some(ssid),
                    signal_strength: None,
                    is_connected: true,
                    bssid: None,
                    mac_address: None,
                    channel: None,
                    security: None,
                    phy_mode: None,
                    mcs_index: None,
                    nss: None,
                    tx_rate: None,
                    noise: None,
                    country_code: None,
                };
            }
            eprintln!("networksetup output unexpected: {}", s);
            WifiInfo {
                ssid: None,
                signal_strength: None,
                is_connected: false,
                bssid: None,
                mac_address: None,
                channel: None,
                security: None,
                phy_mode: None,
                mcs_index: None,
                nss: None,
                tx_rate: None,
                noise: None,
                country_code: None,
            }
        }
        Ok(o) => {
            eprintln!("networksetup command failed with status: {:?}", o.status);
            if !o.stderr.is_empty() {
                eprintln!(
                    "networksetup stderr: {}",
                    String::from_utf8_lossy(&o.stderr)
                );
            }
            WifiInfo {
                ssid: None,
                signal_strength: None,
                is_connected: false,
                bssid: None,
                mac_address: None,
                channel: None,
                security: None,
                phy_mode: None,
                mcs_index: None,
                nss: None,
                tx_rate: None,
                noise: None,
                country_code: None,
            }
        }
        Err(e) => {
            eprintln!("networksetup command failed: {:?}", e);
            WifiInfo {
                ssid: None,
                signal_strength: None,
                is_connected: false,
                bssid: None,
                mac_address: None,
                channel: None,
                security: None,
                phy_mode: None,
                mcs_index: None,
                nss: None,
                tx_rate: None,
                noise: None,
                country_code: None,
            }
        }
    }
}

