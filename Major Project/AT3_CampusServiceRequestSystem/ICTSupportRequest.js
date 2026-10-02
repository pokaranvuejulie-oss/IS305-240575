const ServiceRequest = require("./ServiceRequest");

class ICTSupportRequest extends ServiceRequest {
    #deviceType;
    #systemName;
    #faultType;
    #networkImpact;

    constructor(
        requestId,
        requester,
        title,
        description,
        campusLocation,
        category,
        priority,
        deviceType,
        systemName,
        faultType,
        networkImpact
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

        this.#deviceType = deviceType;
        this.#systemName = systemName;
        this.#faultType = faultType;
        this.#networkImpact = networkImpact;
    }

    getDeviceType() {
        return this.#deviceType;
    }

    getSystemName() {
        return this.#systemName;
    }

    getFaultType() {
        return this.#faultType;
    }

    getNetworkImpact() {
        return this.#networkImpact;
    }
validateSpecialisedFields() {
    if (!this.#deviceType || this.#deviceType.trim() === "") {
        throw new Error("Device type is required.");
    }

    if (!this.#systemName || this.#systemName.trim() === "") {
        throw new Error("System name is required.");
    }

    if (!this.#faultType || this.#faultType.trim() === "") {
        throw new Error("Fault type is required.");
    }

    if (!this.#networkImpact || this.#networkImpact.trim() === "") {
        throw new Error("Network impact is required.");
    }

    const validNetworkImpacts = ["Low", "Medium", "High"];

    if (!validNetworkImpacts.includes(this.#networkImpact)) {
        throw new Error("Network impact must be Low, Medium, or High.");
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

        if (this.#networkImpact.toLowerCase() === "high") {
            score += 2;
        }

        return score;
    }
        getTargetResolutionHours() {
        if (this.getPriority() === "Urgent") {
            return 4;
        }

        if (this.getPriority() === "High") {
            return 8;
        }

        if (this.getPriority() === "Normal") {
            return 24;
        }

        return 48;
    }
    getRequestSummary() {
        return `${super.getRequestSummary()}
Device Type: ${this.#deviceType}
System Name: ${this.#systemName}
Fault Type: ${this.#faultType}
Network Impact: ${this.#networkImpact}`;
    }
}

module.exports = ICTSupportRequest;