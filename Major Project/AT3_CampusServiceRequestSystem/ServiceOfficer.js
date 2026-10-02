const User = require("./User");

class ServiceOfficer extends User {
    #serviceSection;

    constructor(userId, firstName, lastName, email, serviceSection) {
        super(userId, firstName, lastName, email, "Service Officer");

        this.#serviceSection = serviceSection;
    }

    getServiceSection() {
        return this.#serviceSection;
    }

    setServiceSection(serviceSection) {
        if (!serviceSection || serviceSection.trim() === "") {
            throw new Error("Service section cannot be empty.");
        }

        this.#serviceSection = serviceSection;
    }

    displayInfo() {
        return `${super.displayInfo()} - Service Section: ${this.#serviceSection}`;
    }
}

module.exports = ServiceOfficer;