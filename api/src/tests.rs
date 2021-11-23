use super::rocket;
use rocket::http::Status;
use rocket::local::blocking::Client;

#[test]
fn test_404() {
    let client = Client::tracked(rocket()).expect("valid rocket instance");
    let response = client.get("/false_route").dispatch();
    assert_eq!(response.status(), Status::NotFound);
    assert_eq!(
        response.into_string().unwrap(),
        r#"{"message":"Sorry, '/false_route' is not a valid path."}"#
    );
}
