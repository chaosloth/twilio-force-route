exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  try {
    switch (event.EventType) {
      case "task.created": {
        console.log("Task created");
        let taskAttributes = JSON.parse(event.TaskAttributes);
        console.log("TR Attributes", taskAttributes);
        console.log("Call SID", taskAttributes.call_sid);

        let phone = taskAttributes.to.split(":")[1].split("@")[0];
        console.log(`We are transferring to: ${phone}`);

        const client = context.getTwilioClient();

        await client
          .calls(taskAttributes.call_sid)
          .update({
            twiml: `<Response><Dial callerId="${context.CALLER_ID}">${phone}</Dial></Response>`,
          })
          .then((call) => {
            console.log(call.to);
          });
      }
      default: {
        console.log(`Some other event i don't care about ${event.EventType}`);
      }
    }

    response.setBody({ status: "done" });
    callback(null, response);
  } catch (err) {
    console.log("Borked", err);
    response.setBody({ status: "error" });
  }
};
