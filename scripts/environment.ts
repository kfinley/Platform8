const fs = require("fs");
const yaml = require("yaml");

export function load() {
  // TODO: Load from config
  const services = [];

  let environment = {};
  services.forEach((service) => {
    const basePath = `./services/${service}/`;
    const serviceName = service;
    let file = fs.readFileSync(`${basePath}infrastructure/environment.yml`, "utf8");
    file = file.replace(/\$\{self:service::toUpperCase\}/g, serviceName.toUpperCase());
    file = file.replace(/\$\{self:service\}/g, serviceName);
    const serviceEnvironment = yaml.parse(file);

    environment = {
      ...environment,
      ...serviceEnvironment,
    };
  });

  return environment;
};
