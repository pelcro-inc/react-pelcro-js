const fs = require("fs");
const request = require("request");
const path = require("path");

const locallyUpdatePelcroSDK = () => {
  const url = "https://js.pelcro.com/sdk/sandbox/main.min.js";
  const dirPath = path.resolve(__dirname, "./downloads");
  const downloadPath = dirPath + "/pelcro-sdk.js";

  request.head(url, (err, res, body) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    request(url)
      .pipe(fs.createWriteStream(downloadPath))
      .on("close", () => {
        console.log("✅ Updated local sdk file");
        process.exit(0);
      });
  });
};

locallyUpdatePelcroSDK();
