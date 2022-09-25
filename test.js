const axios = require('axios');

axios.post("http://95.85.115.26:8786/message-exist", {
    phone: "asd",
    text: "asd",
  }).then(res => {
      console.log(res.data);
      process.exit(0);
  });