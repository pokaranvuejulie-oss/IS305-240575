const User = require("./User");

class Technician extends User {
    #technicalSpeciality;

    constructor(userId, firstName, lastName, email, technicalSpeciality) {
        super(userId, firstName, lastName, email, "Technician");

        this.#technicalSpeciality = technicalSpeciality;
    }

    getTechnicalSpeciality() {
        return this.#technicalSpeciality;
    }

    setTechnicalSpeciality(technicalSpeciality) {
        if (!technicalSpeciality || technicalSpeciality.trim() === "") {
            throw new Error("Technical speciality cannot be empty.");
        }

        this.#technicalSpeciality = technicalSpeciality;
    }

    displayInfo() {
        return `${super.displayInfo()} - Technical Speciality: ${this.#technicalSpeciality}`;
    }
    toData() {
    return {
        ...super.toData(),
        technicalSpeciality: this.#technicalSpeciality
    };
}
}

module.exports = Technician;