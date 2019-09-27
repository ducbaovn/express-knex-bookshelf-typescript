import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

export class Config {
    public static loadSetting(): any {
        let conf = {};
        let url = path.join(__dirname, "..", "configs");
        if (process.env.NODE_ENV == null) {
            process.env.NODE_ENV = "development";
        }
        try {
            let doc = yaml.safeLoad(fs.readFileSync(`${url}/${process.env.NODE_ENV}.yaml`, "utf8"));
            for (let key of Object.keys(doc)) {
                let val = doc[key];
                if (val != null) {
                    conf[key] = val;
                }
            }
        } catch (err) {
            console.log(`Error when loading configuration file ${process.env.NODE_ENV}.yaml, fallback to configuration.yaml`);
            try {
                let doc = yaml.safeLoad(fs.readFileSync(`${url}/configuration.yaml`, "utf8"));
                for (let key of Object.keys(doc)) {
                    let val = doc[key];
                    if (val != null) {
                        conf[key] = val;
                    }
                }
            } catch (err) {
                console.log(`Error when loading configuration file configuration.yaml, using default value for each module: ${err.message}`);
            }
        }
        return conf;
    }
}

export default Config;
