import {environment} from "./environments/environment";
var config = {
  backendURL: "http://localhost:8080/"
}
if (environment.production) {
  config = {
    backendURL:  location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+'/'
  }
}

export default config;