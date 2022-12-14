import fs from "fs";
import { watchFile } from 'node:fs';

import { Scheduler } from "./lib/Scheduler";
import { TesterantoProject } from "./Project";

console.log("watch.ts", process.cwd(), process.argv);

const configFile = `${process.cwd()}/${process.argv[2]}`;

console.log("watch.ts configFile", configFile);

import(configFile).then((configModule) => {

  console.log("build.ts tProject", configModule);
  const tProject = new TesterantoProject(configModule.tests, configModule.features, configModule.ports)
  console.log("build.ts tProject", tProject);

  const TRM = new Scheduler(tProject.ports);

  (async function () {
    for await (const [ndx, [key, sourcefile, className]] of tProject.tests.entries()) {
      const distFile = process.cwd() + "/dist/" + sourcefile.split(".ts")[0] + ".js";
      const md5File = process.cwd() + "/dist/" + sourcefile.split(".ts")[0] + ".md5";

      fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
        TRM.testFileTouched(key, distFile, className, firstmd5hash);

        watchFile(md5File, () => {
          fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
            if (err) {
              console.error(err)
              process.exit(-1)
            }

            TRM.testFileTouched(key, distFile, className, newmd5Hash);
          })
        });
      });
    }

    ///////////////////////////////////////////////////////////////////////////////////////

    const featureFile = tProject.features;
    const distFile = process.cwd() + "/dist/" + featureFile.split(".ts")[0] + ".js";
    const md5File = process.cwd() + "/dist/" + featureFile.split(".ts")[0] + ".md5";

    fs.readFile(featureFile, 'utf-8', (err, featuresFileContents) => {
      TRM.featureFileTouched(distFile, featuresFileContents);

      watchFile(md5File, () => {
        fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
          if (err) {
            console.error(err)
            process.exit(-1)
          }

          TRM.featureFileTouched(distFile, newmd5Hash);
        })
      });
    });



    TRM.launch();

  })();

})
