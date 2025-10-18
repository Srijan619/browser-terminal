use serde::Serialize;

#[derive(Serialize)]
pub struct AwdlInfo {
    pub enabled: bool,
    pub mac_address: Option<String>,
    pub interface_name: Option<String>,
    pub airdrop_disc_mode: Option<String>,
}

pub async fn get_awdl_info() -> AwdlInfo {
    #[cfg(target_os = "macos")]
    {
        use tokio::process::Command;

        let output = Command::new("sudo").args(["wdutil", "info"]).output().await;

        match output {
            Ok(o) if o.status.success() => {
                let s = String::from_utf8_lossy(&o.stdout);
                let mut awdl_info = AwdlInfo {
                    enabled: false,
                    mac_address: None,
                    interface_name: None,
                    airdrop_disc_mode: None,
                };

                for line in s.lines() {
                    if line.contains("AWDL Enabled") {
                        awdl_info.enabled = line.split(':').last().unwrap_or("").trim() == "Yes";
                    } else if line.contains("MAC Address") && line.contains("awdl") {
                        awdl_info.mac_address =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("Interface Name") && line.contains("awdl") {
                        awdl_info.interface_name =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    } else if line.contains("AirDrop Disc Mode") {
                        awdl_info.airdrop_disc_mode =
                            Some(line.split(':').last().unwrap_or("").trim().to_string());
                    }
                }

                awdl_info
            }
            _ => {
                eprintln!("wdutil command failed for AWDL");
                AwdlInfo {
                    enabled: false,
                    mac_address: None,
                    interface_name: None,
                    airdrop_disc_mode: None,
                }
            }
        }
    }

    #[cfg(not(target_os = "macos"))]
    {
        AwdlInfo {
            enabled: false,
            mac_address: None,
            interface_name: None,
            airdrop_disc_mode: None,
        }
    }
}
