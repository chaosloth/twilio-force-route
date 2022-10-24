exports.handler = function (context, event, callback) {
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  try {
    let To = event.To;

    console.log(`We have the incoming SIP URI of: ${To}`);

    let phone = To.split(":")[1].split("@")[0];

    console.log(`We parsed the result as: ${phone}`);

    response.setBody({ phone: phone });

    callback(null, response);
  } catch (err) {
    console.log("Borked", err);
    response.setBody({ status: "error" });
  }
};
