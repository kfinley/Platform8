const fs = require("fs");
const yaml = require("yaml");

export function load() {

    // TODO: Load from config
    const services = ["Transactions"];

    let stateMachines = {};
    services.forEach((service) => {
        const basePath = `./services/${service}/`;
        const serviceName = service

        let file = fs.readFileSync(`${basePath}infrastructure/stateMachines.yml`, "utf8");
        file = file.replace(/\$\{self:service:::toUpperCase\}/g, serviceName.toUpperCase);
        file = file.replace(/\$\{self:service\}/g, serviceName);
        const serviceStateMachines = yaml.parse(file);

        stateMachines = {
            ...stateMachines,
            ...serviceStateMachines,
        };
    });

    return stateMachines;
}
