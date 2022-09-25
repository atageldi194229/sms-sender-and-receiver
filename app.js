let serialportgsm = require("serialport-gsm");
let fs = require("fs");
let modem = serialportgsm.Modem();
let options = {
  baudRate: 115200,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
  rtscts: false,
  xon: false,
  xoff: false,
  xany: false,
  autoDeleteOnReceive: false,
  enableConcatenation: true,
  incomingCallIndication: true,
  incomingSMSIndication: true,
  pin: "0000",
  customInitCommand: "",
  cnmiCommand: "AT+CNMI=2,1,0,2,1",
  logger: console,
};
const port = "/dev/ttyUSB0";

// serialportgsm.list((err, result) => {
//   console.log(result)
// })

modem.open(port, options, (err) => {
  console.log(err);

  // modem.on("onNewMessage", function (...args) {
  //   console.log("111: ", args);
  // });
});

let log_filename = "./sent-contacts.txt";
function readAllContacts(from) {
  if (fs.existsSync(from)) {
    let data = fs.readFileSync(from).toString();

    // return data.split(/\s\s+/g).filter(e => e.trim().length);
    let arr = data
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length === 11 && e.startsWith("9936"));

    arr = [...new Set(arr)];

    console.log("=".repeat(10), arr.length);

    return arr;
  }

  return [];
}

const sentContacts = readAllContacts(log_filename);

const contacts = readAllContacts("./contacts.txt");

const messageText = fs.readFileSync("./message.txt").toString();

function logSentContact(contact) {
  sentContacts.push(contact);
  fs.appendFileSync(log_filename, "\n" + contact);
}

modem.on("onMemoryFull", (...args) => {
  fs.appendFile("./memory-full.txt", JSON.stringify(args, null, 2));
  console.log(JSON.stringify(args, null, 2));

  modem.deleteAllSimMessages((...args) => {
    console.log("message no-", new Date().getTime() - t0, err.status);
    console.log(...args);
  });
});

modem.on("open", (data) => {
  // modem.setModemMode((...args) => {
  //   console.log("pdu", args);
  // }, 'PDU')
  modem.initializeModem((err) => {
    console.log(err);

    const t0 = new Date().getTime();
    let done_count = 0;

    while (contacts.length) {
      let contact = contacts.shift();

      if (sentContacts.includes(contact)) continue;

      console.log("Trying to send to:", contact);

      modem.sendSMS(contact, messageText, false, (err) => {
        // console.log(err);

        if (
          err.status === "success" &&
          err.data.response === "Message Successfully Sent"
        ) {
          console.log(
            "message no-",
            sentContacts.length + 1,
            new Date().getTime() - t0,
            err.status
          );
          done_count++;

          logSentContact(contact);
        } else if (err.status !== "success") {
          fs.appendFileSync("./error", "\n\n" + JSON.stringify(err, null, 2));
        }
      });
    }

    // modem.deleteAllSimMessages((...args) => {
    //   console.log("message no-", new Date().getTime() - t0, err.status);
    //   console.log(...args);
    // });

    // modem.sendSMS('99364530230', `salam`, false, (err)=>{
    //   console.log(new Date().getTime() - t0);

    //   console.log("=".repeat(20));
    //   console.log(err);
    //   console.log("=".repeat(20));

    //   // modem.deleteAllSimMessages((...args) => {
    //   //   console.log("delete all sim mess", new Date().getTime() - t0, err.status);
    //   //   console.log(...args);
    //   // });
    // });

    // modem.getSimInbox((data) => {
    //   console.log("Message: ", data);
    // });

    // modem.on('onNewMessage', function (...args) {
    //   console.log("123: ", args);
    // });
  });

  // modem.on('onNewMessage', function (...args) {
  //   console.log("222: ", args);
  // });
});

// modem.on('onNewMessage', function (...args) {
//   console.log(args);
// });
