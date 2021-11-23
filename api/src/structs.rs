use rocket::serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub message: String,
}

#[derive(Serialize, Deserialize)]
pub struct NameDetails {
    pub name: String,
}

#[derive(Serialize, Deserialize)]
pub struct Place {
    pub place_id: u32,
    pub lat: String,
    pub lon: String,
    pub display_name: String,
    pub namedetails: NameDetails,
}

#[derive(Serialize, Deserialize)]
pub struct Journey {
    pub notes: Vec<Value>,
}
