const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const ejs = require("ejs");
const app = express();

app.set("view engine","ejs");

var cityLocation;

const date = new Date();
const currentDay = date.getDay();
var day = "";
const whichDay = (day)=>{
	switch (day){
		case 0:
			day = "Sunday";
			break;
		case 1:
			day = "Monday";
			break;
		case 2:
			day = "Tuesday";
			break;
		case 3:
			day = "Wednesday";
			break;
		case 4:
			day = "Thursday";
			break;
		case 5:
			day = "Friday";
			break;
		case 6:
			day = "Saturday";
			break;


	}
	return day;
}

var temprature = "";
var weatherDesc = "";

app.get("/", (request,respond) => {
	https.get("https://api64.ipify.org/?format=json",(result)=>{
		result.on("data", (data)=>{
			const userIpAdress = JSON.parse(data).ip;
			https.get("https://ipinfo.io/"+userIpAdress+"?token=9f3db1a392a5e7", (res) => {
				res.on("data", (data)=>{
					const locationData = JSON.parse(data);
					cityLocation = locationData.city;
					https.get("https://api.openweathermap.org/data/2.5/weather?q="+cityLocation+"&units=metric"+"&appId="+appId,(result)=>{
						result.on("data",(data)=>{
							const cityData = JSON.parse(data);
							temprature = cityData.main.feels_like;
							weatherDesc = cityData.weather[0].description;
						});
					});

				});
			});
		});
	});
	const appId = "289f7867c1a067b5014adcf0a7f3dcfe";
	setTimeout(async ()=>{
		day = whichDay(currentDay);
		temprature = Math.floor(temprature);
		respond.render("index",{location:cityLocation,currentDay: day,temprature:temprature,desc:weatherDesc});	
	},2000);

});

app.listen(process.env.PORT || 3000,()=>{console.log("server is running on port 3000")});
