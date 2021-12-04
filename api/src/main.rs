mod structs;
#[cfg(test)]
mod tests;

#[macro_use]
extern crate rocket;

use crate::structs::Message;

use dotenv_codegen::dotenv;
use reqwest::header::{AUTHORIZATION, USER_AGENT};
use rocket::serde::json::{Json, Value};
use rocket::Request;

const NOMINATIM_API_ENDPOINT: &str = "https://nominatim.openstreetmap.org";
const NAVITIA_API_ENDPOINT: &str = "https://api.navitia.io/v1";
const NAVITIA_TOKEN: &str = dotenv!("NAVITIA_TOKEN");

#[get("/places/<query>")]
async fn places(query: &str) -> Option<Value> {
    let url = format!(
        "{nominatim}?format=json&limit=5&namedetails=1&q={query}",
        nominatim = NOMINATIM_API_ENDPOINT,
        query = query
    );

    let client = reqwest::Client::new();

    let res: Value = client
        .get(url)
        .header(USER_AGENT, "Rocket") // somehow nominatim refuses the request without USER_AGENT
        .send()
        .await
        .ok()?
        .json()
        .await
        .ok()?;

    Some(res)
}

#[get("/journey?<cur_loc_lon>&<cur_loc_lat>&<des_loc_lon>&<des_loc_lat>")]
async fn journey(
    cur_loc_lon: &str,
    cur_loc_lat: &str,
    des_loc_lon: &str,
    des_loc_lat: &str,
) -> Option<Value> {
    let url = format!(
        "{navitia}/coverage/{cur_loc_lon}%3B{cur_loc_lat}/journeys?from={cur_loc_lon}%3B{cur_loc_lat}&to={des_loc_lon}%3B{des_loc_lat}",
        navitia = NAVITIA_API_ENDPOINT,
        cur_loc_lon=cur_loc_lon,
        cur_loc_lat=cur_loc_lat,
        des_loc_lon=des_loc_lon,
        des_loc_lat=des_loc_lat,
    );

    let client = reqwest::Client::new();

    let res: Value = client
        .get(url)
        .header(AUTHORIZATION, NAVITIA_TOKEN)
        .send()
        .await
        .ok()?
        .json()
        .await
        .ok()?;

    Some(res)
}

#[get("/departures?<stop_area>&<cur_loc_lon>&<cur_loc_lat>")]
async fn departures(stop_area: &str, cur_loc_lon: &str, cur_loc_lat: &str) -> Option<Value> {
    let url = format!(
        "{navitia}/coverage/{cur_loc_lon}%3B{cur_loc_lat}/stop_areas/{stop_area}/departures?items_per_schedule=2",
        navitia = NAVITIA_API_ENDPOINT,
        cur_loc_lon=cur_loc_lon,
        cur_loc_lat=cur_loc_lat,
        stop_area = stop_area
    );

    let client = reqwest::Client::new();

    let res: Value = client
        .get(url)
        .header(AUTHORIZATION, NAVITIA_TOKEN)
        .send()
        .await
        .ok()?
        .json()
        .await
        .ok()?;

    Some(res)
}

#[catch(404)]
fn not_found(req: &Request) -> Json<Message> {
    Json(Message {
        message: format!("Sorry, '{}' is not a valid path.", req.uri(),),
    })
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .register("/", catchers![not_found])
        .mount("/", routes![places, journey, departures])
}
