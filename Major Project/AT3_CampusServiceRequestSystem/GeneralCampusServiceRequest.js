const ServiceRequest = require("./ServiceRequest");

class GeneralCampusServiceRequest extends ServiceRequest {
    #serviceType;
    #additionalDetails;

    constructor(
        requestId,
        requester,
        title,
        description,
        campusLocation,
        priority,
        serviceType,
        additionalDetails = ""
    ) {
        super(
            requestId,
            requester,
            title,
            description,
            campusLocation,
            "General Campus Service",
            priority
        );

        this.#serviceType = serviceType;
        this.#additionalDetails = additionalDetails;

        this.validate();
    }

    getServiceType() {
        return this.#serviceType;
    }

    getAdditionalDetails() {
        return this.#additionalDetails;
    }

    setServiceType(serviceType) {
        if (!serviceType || serviceType.trim() === "") {
            throw new Error("Service type is required.");
        }

        this.#serviceType = serviceType;
    }

    setAdditionalDetails(additionalDetails) {
        this.#additionalDetails = additionalDetails || "";
    }

    validate() {
        super.validate();

        if (!this.#serviceType || this.#serviceType.trim() === "") {
            throw new Error("Service type is required.");
        }

        return true;
    }

    calculatePriorityScore() {
        const scores = {
            Low: 1,
            Normal: 2,
            High: 3,
            Urgent: 4
        };

        return scores[this.getPriority()];
    }

    getTargetResolutionHours() {
        const resolutionTimes = {
            Urgent: 8,
            High: 24,
            Normal: 48,
            Low: 72
        };

        return resolutionTimes[this.getPriority()];
    }

    getRequestSummary() {
        return (
            `${this.getRequestId()} | ` +
            `${this.getCategory()} | ` +
            `${this.getPriority()} | ` +
            `${this.getStatus()} | ` +
            `Service Type: ${this.#serviceType}`
        );
    }

    toData() {
        return {
            ...super.toData(),
            serviceType: this.#serviceType,
            additionalDetails: this.#additionalDetails
        };
    }
}

module.exports = GeneralCampusServiceRequest;