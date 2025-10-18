use axum::{
    http::{self, header::ORIGIN, Method},
    routing::get,
    Json, Router,
};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
mod awdl;
mod battery;
mod bluetooth;
mod wifi;

async fn wifi_info() -> Json<wifi::WifiInfo> {
    Json(wifi::get_wifi_info().await)
}

async fn bluetooth_info() -> Json<bluetooth::BluetoothInfo> {
    Json(bluetooth::get_bluetooth_info().await)
}

async fn battery_info() -> Json<battery::BatteryInfo> {
    Json(battery::get_battery_info().await)
}

async fn awdl_info() -> Json<awdl::AwdlInfo> {
    Json(awdl::get_awdl_info().await)
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET])
        .allow_origin(
            "http://localhost:5173"
                .parse::<http::HeaderValue>()
                .unwrap(),
        )
        .allow_headers([ORIGIN]);

    let app = Router::new()
        .route("/wifi", get(wifi_info))
        .route("/bluetooth", get(bluetooth_info))
        .route("/battery", get(battery_info))
        .route("/awdl", get(awdl_info))
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await.unwrap();

    println!(
        "Server running at http://{}",
        listener.local_addr().unwrap()
    );
    axum::serve(listener, app).await.unwrap();
}
