use battery::Manager;
use serde::Serialize;

#[derive(Serialize)]
pub struct BatteryInfo {
    pub percentage: f32,
    pub state: String,
    pub warning_level: String,
}

pub async fn get_battery_info() -> BatteryInfo {
    let manager = Manager::new().unwrap();
    let battery = manager.batteries().unwrap().next().unwrap().unwrap();

    let percentage = battery.state_of_charge().value * 100.0;
    let warning_level = if percentage < 10.0 {
        "Critical".to_string()
    } else if percentage < 20.0 {
        "Low".to_string()
    } else {
        "None".to_string()
    };

    BatteryInfo {
        percentage,
        state: format!("{:?}", battery.state()),
        warning_level,
    }
}

