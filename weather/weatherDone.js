
// MAIN PROGRAM

var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?";
var weatherToken = "APPID=YOUR_API_KEY_GOES_HERE";

var zip;      // zipcode we will query the user for
var weather;  // response JSON from openweathermap API
var weatherMesssage;  // string response we will send to end user


// INTERACTIVE SCRIPT

// (1) Query user for zipcode
answer();
zip = ask("Hello user, for what zipcode do you require weather information?", { choices:"[5 DIGITS]"});

// (2) Query API for weather data
weather = JSON.parse(getURL(weatherAPI + weatherToken + "&zip="  + zip.value));

// (3) Respond to user
weatherMessage = weatherToString(weather,0);
say(weatherMessage);

message(weatherMessage, {
  to: currentCall.callerID,
  network: "SMS"
});

// (4) Terminate the call
hangup();




// ***********************
// HELPER FUNCTIONS
// ***********************

// getURL - do an HTTP get against a URL
function getURL(url){

    connection = new java.net.URL(url).openConnection();
    connection.setDoOutput(false);
    connection.setDoInput(true);
    connection.setInstanceFollowRedirects(false);
    connection.setRequestMethod("GET");
    connection.setRequestProperty("Content-Type", "text/plain");
    connection.setRequestProperty("charset", "utf-8");
    connection.connect();

    var retvalue = "";

    dis = new java.io.DataInputStream(connection.getInputStream());
    while (dis.available() != 0) {
        line = dis.readLine();
        retvalue +=line;
    }

    return retvalue;
}

// weatherToString - create a string representation of weather data from openweathermap API
function weatherToString(wdata, ndig) {
  var temp = ktof(wdata["main"]["temp"]).toFixed(ndig);
  var tempmin = ktof(wdata["main"]["temp_min"]).toFixed(ndig);
  var tempmax = ktof(wdata["main"]["temp_max"]).toFixed(ndig);
  var wname = wdata["name"];

  var wdesc = "The temperature in " + wname + " is " + temp + " degrees.  The forecast high is " + tempmax + " and the low is " + tempmin;
  return wdesc;

}

// ktof - convert from Kelvin to Fahrenheit
function ktof(temp) {
  return temp * (9/5) - 459.67;
}
