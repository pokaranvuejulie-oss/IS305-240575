const ServiceRequest = require("./ServiceRequest");

class MaintenanceRequest extends ServiceRequest {
    #building;
    #roomNumber;
    #hazardLevel;
    #equipmentAffected;

    constructor(
        requestId,
        requester,
        title,
        description,
        campusLocation,
        category,
        priority,
        building,
        roomNumber,
        hazardLevel,
        equipmentAffected
    ) {
        super(
            requestId,
            requester,
            title,
            description,
            campusLocation,
            category,
            priority
        );

        this.#building = building;
        this.#roomNumber = roomNumber;
        this.#hazardLevel = hazardLevel;
        this.#equipmentAffected = equipmentAffected;
    }

    getBuilding() {
        return this.#building;
    }

    getRoomNumber() {
        return this.#roomNumber;
    }

    getHazardLevel() {
        return this.#hazardLevel;
    }

    getEquipmentAffected() {
        return this.#equipmentAffected;
    }
validateSpecialisedFields() {
    if (!this.#building || this.#building.trim() === "") {
        throw new Error("Building is required.");
    }

    if (!this.#roomNumber || this.#roomNumber.trim() === "") {
        throw new Error("Room number is required.");
    }

    if (!this.#hazardLevel || this.#hazardLevel.trim() === "") {
        throw new Error("Hazard level is required.");
    }

    if (!this.#equipmentAffected || this.#equipmentAffected.trim() === "") {
        throw new Error("Equipment affected is required.");
    }

    const validHazardLevels = ["Low", "Medium", "High"];

    if (!validHazardLevels.includes(this.#hazardLevel)) {
        throw new Error("Hazard level must be Low, Medium, or High.");
    }

    return true;
}
   

    validate() {
        super.validate();
        this.validateSpecialisedFields();

        return true;
    }
    calculatePriorityScore() {
        let score = 0;

        if (this.getPriority() === "Low") {
            score = 1;
        } else if (this.getPriority() === "Normal") {
            score = 2;
        } else if (this.getPriority() === "High") {
            score = 3;
        } else if (this.getPriority() === "Urgent") {
            score = 4;
        }

        if (this.#hazardLevel.toLowerCase() === "high") {
            score += 2;
        }

        return score;
    }

    getTargetResolutionHours() {
        if (this.getPriority() === "Urgent") {
            return 8;
        }

        if (this.getPriority() === "High") {
            return 24;
        }

        if (this.getPriority() === "Normal") {
            return 48;
        }

        return 72;
    }
    getRequestSummary() {
        return `${super.getRequestSummary()}
Building: ${this.#building}
Room Number: ${this.#roomNumber}
Hazard Level: ${this.#hazardLevel}
Equipment Affected: ${this.#equipmentAffected}`;
    }
    toData() {
    return {
        ...super.toData(),
        building: this.#building,
        roomNumber: this.#roomNumber,
        hazardLevel: this.#hazardLevel,
        equipmentAffected: this.#equipmentAffected
    };
}
}

module.exports = MaintenanceRequest;