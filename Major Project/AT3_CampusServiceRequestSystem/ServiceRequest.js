class ServiceRequest {
    #requestId;
    #requester;
    #technician;
    #requestHistory;
    #title;
    #description;
    #campusLocation;
    #category;
    #priority;
    #status;
    #dateSubmitted;
    #dateUpdated;

    constructor(
        requestId,
        requester,
        title,
        description,
        campusLocation,
        category,
        priority
    ) {
        this.#requestId = requestId;
        this.#requester = requester;
        this.#technician = null;
        this.#requestHistory = [];
        this.#title = title;
        this.#description = description;
        this.#campusLocation = campusLocation;
        this.#category = category;
        this.#priority = priority;
        this.#status = "Submitted";
        this.#dateSubmitted = new Date();
        this.#dateUpdated = new Date();
    }

    getRequestId() {
        return this.#requestId;
    }

    getRequester() {
        return this.#requester;
    }
        getTechnician() {
        return this.#technician;
    }

    getRequestHistory() {
        return this.#requestHistory;
    }

    getTitle() {
        return this.#title;
    }

    getDescription() {
        return this.#description;
    }

    getCampusLocation() {
        return this.#campusLocation;
    }

    getCategory() {
        return this.#category;
    }

    getPriority() {
        return this.#priority;
    }

    getStatus() {
        return this.#status;
    }

    getDateSubmitted() {
        return this.#dateSubmitted;
    }

    getDateUpdated() {
        return this.#dateUpdated;
    }

    setTitle(title) {
        if (!title || title.trim() === "") {
            throw new Error("Title cannot be empty.");
        }

        this.#title = title;
        this.#dateUpdated = new Date();
    }

    setDescription(description) {
        if (!description || description.trim() === "") {
            throw new Error("Description cannot be empty.");
        }

        this.#description = description;
        this.#dateUpdated = new Date();
    }

    setCampusLocation(campusLocation) {
        if (!campusLocation || campusLocation.trim() === "") {
            throw new Error("Campus location cannot be empty.");
        }

        this.#campusLocation = campusLocation;
        this.#dateUpdated = new Date();
    }

    setCategory(category) {
        const validCategories = [
            "ICT Support",
            "Facilities Maintenance",
            "Cleaning and Sanitation",
            "General Campus Service"
        ];

        if (!validCategories.includes(category)) {
            throw new Error("Unsupported service category.");
        }

        this.#category = category;
        this.#dateUpdated = new Date();
    }

    setPriority(priority) {
        const validPriorities = ["Low", "Normal", "High", "Urgent"];

        if (!validPriorities.includes(priority)) {
            throw new Error("Unsupported priority.");
        }

        this.#priority = priority;
        this.#dateUpdated = new Date();
    }

    validate() {
        if (!this.#requestId || this.#requestId.trim() === "") {
            throw new Error("Request ID is required.");
        }

        if (!this.#requester) {
            throw new Error("Requester is required.");
        }

        if (!this.#title || this.#title.trim() === "") {
            throw new Error("Title is required.");
        }

        if (!this.#description || this.#description.trim() === "") {
            throw new Error("Description is required.");
        }

        if (!this.#campusLocation || this.#campusLocation.trim() === "") {
            throw new Error("Campus location is required.");
        }

        const validCategories = [
            "ICT Support",
            "Facilities Maintenance",
            "Cleaning and Sanitation",
            "General Campus Service"
        ];

        if (!validCategories.includes(this.#category)) {
            throw new Error("Unsupported service category.");
        }

        const validPriorities = ["Low", "Normal", "High", "Urgent"];

        if (!validPriorities.includes(this.#priority)) {
            throw new Error("Unsupported priority.");
        }

        return true;
    }

    updateDetails(changes) {
        if (this.#status !== "Submitted") {
            throw new Error("Only Submitted requests can be updated.");
        }

        if (changes.title !== undefined) {
            this.setTitle(changes.title);
        }

        if (changes.description !== undefined) {
            this.setDescription(changes.description);
        }

        if (changes.campusLocation !== undefined) {
            this.setCampusLocation(changes.campusLocation);
        }

        if (changes.category !== undefined) {
            this.setCategory(changes.category);
        }

        if (changes.priority !== undefined) {
            this.setPriority(changes.priority);
        }

        this.#dateUpdated = new Date();
    }

    cancelRequest() {
        if (this.#status === "Cancelled") {
            throw new Error("Request is already cancelled.");
        }

        if (this.#status !== "Submitted") {
            throw new Error("Only Submitted requests can be cancelled.");
        }

        this.#status = "Cancelled";
        this.#dateUpdated = new Date();
    }
    calculatePriorityScore() {
        throw new Error(
            "calculatePriorityScore() must be implemented by a specialised request class."
        );
    }

    getTargetResolutionHours() {
        throw new Error(
            "getTargetResolutionHours() must be implemented by a specialised request class."
        );
    }
    getRequestSummary() {
    throw new Error(
        "getRequestSummary() must be implemented by a specialised request class."
    );
}

    reviewRequest() {
        if (this.#status !== "Submitted") {
            throw new Error("Only Submitted requests can be reviewed.");
        }

        this.#status = "Reviewed";
        this.#dateUpdated = new Date();
    }

    assignTechnician(technician) {
        if (this.#status !== "Reviewed") {
            throw new Error("Only Reviewed requests can be assigned.");
        }

        if (!technician) {
            throw new Error("Technician is required.");
        }

        this.#technician = technician;
        this.#status = "Assigned";
        this.#dateUpdated = new Date();
    }

    startWork() {
        if (this.#status !== "Assigned") {
            throw new Error("Only Assigned requests can start work.");
        }

        if (!this.#technician) {
            throw new Error("A technician must be assigned first.");
        }

        this.#status = "In Progress";
        this.#dateUpdated = new Date();
    }

    resolveRequest() {
        if (this.#status !== "In Progress") {
            throw new Error("Only In Progress requests can be resolved.");
        }

        this.#status = "Resolved";
        this.#dateUpdated = new Date();
    }

    closeRequest() {
        if (this.#status !== "Resolved") {
            throw new Error("Only Resolved requests can be closed.");
        }

        this.#status = "Closed";
        this.#dateUpdated = new Date();
    }

    addHistoryEntry(
        previousStatus,
        newStatus,
        action,
        actorId,
        actorRole,
        comment = ""
    ) {
        this.#requestHistory.push({
            previousStatus,
            newStatus,
            action,
            actorId,
            actorRole,
            comment,
            dateTime: new Date()
        });
    }
    restoreState(data, technician = null) {
    const validStatuses = [
        "Submitted",
        "Reviewed",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed",
        "Cancelled"
    ];

    if (!validStatuses.includes(data.status)) {
        throw new Error("Invalid saved request status.");
    }

    this.#technician = technician;

    this.#status = data.status;

    this.#dateSubmitted = data.dateSubmitted
        ? new Date(data.dateSubmitted)
        : new Date();

    this.#dateUpdated = data.dateUpdated
        ? new Date(data.dateUpdated)
        : new Date();

    this.#requestHistory = Array.isArray(data.requestHistory)
        ? data.requestHistory
        : [];
}
  toData() {
    return {
        requestId: this.#requestId,

        requester: this.#requester
            ? this.#requester.toData()
            : null,

        technician: this.#technician
            ? this.#technician.toData()
            : null,

        title: this.#title,
        description: this.#description,
        campusLocation: this.#campusLocation,
        category: this.#category,
        priority: this.#priority,
        status: this.#status,
        dateSubmitted: this.#dateSubmitted,
        dateUpdated: this.#dateUpdated,
        requestHistory: this.#requestHistory
    };
}
}

module.exports = ServiceRequest;  