const ServiceRequest = require("./ServiceRequest");

class CleaningRequest extends ServiceRequest {
    #cleaningArea;
    #hygieneRisk;
    #serviceType;
    #preferredServiceTime;

    constructor(
        requestId,
        requester,
        title,
        description,
        campusLocation,
        category,
        priority,
        cleaningArea,
        hygieneRisk,
        serviceType,
        preferredServiceTime
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

        this.#cleaningArea = cleaningArea;
        this.#hygieneRisk = hygieneRisk;
        this.#serviceType = serviceType;
        this.#preferredServiceTime = preferredServiceTime;
    }

    getCleaningArea() {
        return this.#cleaningArea;
    }

    getHygieneRisk() {
        return this.#hygieneRisk;
    }

    getServiceType() {
        return this.#serviceType;
    }

    getPreferredServiceTime() {
        return this.#preferredServiceTime;
    }
validateSpecialisedFields() {
    if (!this.#cleaningArea || this.#cleaningArea.trim() === "") {
        throw new Error("Cleaning area is required.");
    }

    if (!this.#hygieneRisk || this.#hygieneRisk.trim() === "") {
        throw new Error("Hygiene risk is required.");
    }

    const validHygieneRisks = ["Low", "Medium", "High"];

    if (!validHygieneRisks.includes(this.#hygieneRisk)) {
        throw new Error("Hygiene risk must be Low, Medium, or High.");
    }

    if (!this.#serviceType || this.#serviceType.trim() === "") {
        throw new Error("Service type is required.");
    }

    const validServiceTypes = [
        "Routine Cleaning",
        "Deep Cleaning",
        "Sanitation"
    ];

    if (!validServiceTypes.includes(this.#serviceType)) {
        throw new Error(
            "Service type must be Routine Cleaning, Deep Cleaning, or Sanitation."
        );
    }

    if (
        !this.#preferredServiceTime ||
        this.#preferredServiceTime.trim() === ""
    ) {
        throw new Error("Preferred service time is required.");
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

        if (this.#hygieneRisk.toLowerCase() === "high") {
            score += 2;
        }

        return score;
    }

    getTargetResolutionHours() {
        if (this.getPriority() === "Urgent") {
            return 4;
        }

        if (this.getPriority() === "High") {
            return 12;
        }

        if (this.getPriority() === "Normal") {
            return 24;
        }

        return 48;
    }
    getRequestSummary() {
        return `${super.getRequestSummary()}
Cleaning Area: ${this.#cleaningArea}
Hygiene Risk: ${this.#hygieneRisk}
Service Type: ${this.#serviceType}
Preferred Service Time: ${this.#preferredServiceTime}`;
    }
}

module.exports = CleaningRequest;