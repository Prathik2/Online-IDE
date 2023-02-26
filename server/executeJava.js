const { exec } = require("child_process");
const fs = require("fs");
const path = require('path');
const { stderr } = require("process");

const outputPath = path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true});
}

const executeCpp = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath,`${jobId}`);
    return new Promise((resolve,reject) => {
        exec(
            `javac Main.java && cd ${outputPath} && java Main`,
            (error, stdout, stderr) => {
              error && reject({ error, stderr });
              stderr && reject(stderr);
              resolve(stdout);
            }
          );
    });
};

module.exports = {
    executeCpp,
};