class ServiceRequestManager {
    constructor() {
        this.users = [];
        this.requests = [];
    }

    registerUser(user) {
        user.validate();

        if (this.findUserById(user.getUserId())) {
            throw new Error("User ID already exists.");
        }

        this.users.push(user);
        return user;
    }

    findUserById(userId) {
        return this.users.find(user => user.getUserId() === userId);
    }

    submitRequest(request) {
        request.validate();
        if (typeof request.validateSpecialisedFields === "function") {
            request.validateSpecialisedFields();
        }
        if (this.findRequestById(request.getRequestId())) {
            throw new Error("Request ID already exists.");
        }

        if (!this.findUserById(request.getRequester().getUserId())) {
            throw new Error("Requester must be a registered user.");
        }

        this.requests.push(request);
        return request;
    }
    reviewRequest(requestId, officerId, comment = "") {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        const officer = this.findUserById(officerId);

        if (!officer) {
            throw new Error("Service Officer not found.");
        }

        if (officer.getUserType() !== "Service Officer") {
            throw new Error("Only Service Officers can review requests.");
        }

        const previousStatus = request.getStatus();

        request.reviewRequest();

        request.addHistoryEntry(
            previousStatus,
            request.getStatus(),
            "Review Request",
            officerId,
            officer.getUserType(),
            comment
        );

        return request;
    }
        changePriority(requestId, officerId, newPriority, comment = "") {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        const officer = this.findUserById(officerId);

        if (!officer) {
            throw new Error("Service Officer not found.");
        }

        if (officer.getUserType() !== "Service Officer") {
            throw new Error("Only Service Officers can change priority.");
        }

        const previousPriority = request.getPriority();

        request.setPriority(newPriority);

        request.addHistoryEntry(
            request.getStatus(),
            request.getStatus(),
            "Change Priority",
            officerId,
            officer.getUserType(),
            `${comment} Priority changed from ${previousPriority} to ${newPriority}.`
        );

        return request;
    }

    assignTechnician(requestId, officerId, technicianId, comment = "") {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        const officer = this.findUserById(officerId);

        if (!officer) {
            throw new Error("Service Officer not found.");
        }

        if (officer.getUserType() !== "Service Officer") {
            throw new Error("Only Service Officers can assign technicians.");
        }

        const technician = this.findUserById(technicianId);

        if (!technician) {
            throw new Error("Technician not found.");
        }

        if (technician.getUserType() !== "Technician") {
            throw new Error("Selected user is not a Technician.");
        }

        const previousStatus = request.getStatus();

        request.assignTechnician(technician);

        request.addHistoryEntry(
            previousStatus,
            request.getStatus(),
            "Assign Technician",
            officerId,
            officer.getUserType(),
            comment
        );

        return request;
    }
        startWork(requestId, technicianId, comment = "") {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        const technician = this.findUserById(technicianId);

        if (!technician) {
            throw new Error("Technician not found.");
        }

        if (technician.getUserType() !== "Technician") {
            throw new Error("Only Technicians can start work.");
        }

        if (!request.getTechnician()) {
            throw new Error("No technician has been assigned to this request.");
        }

        if (request.getTechnician().getUserId() !== technicianId) {
            throw new Error("Only the assigned Technician can start work.");
        }

        const previousStatus = request.getStatus();

        request.startWork();

        request.addHistoryEntry(
            previousStatus,
            request.getStatus(),
            "Start Work",
            technicianId,
            technician.getUserType(),
            comment
        );

        return request;
    }
        resolveRequest(requestId, technicianId, comment = "") {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        const technician = this.findUserById(technicianId);

        if (!technician) {
            throw new Error("Technician not found.");
        }

        if (technician.getUserType() !== "Technician") {
            throw new Error("Only Technicians can resolve requests.");
        }

        if (!request.getTechnician()) {
            throw new Error("No technician has been assigned to this request.");
        }

        if (request.getTechnician().getUserId() !== technicianId) {
            throw new Error("Only the assigned Technician can resolve this request.");
        }

        const previousStatus = request.getStatus();

        request.resolveRequest();

        request.addHistoryEntry(
            previousStatus,
            request.getStatus(),
            "Resolve Request",
            technicianId,
            technician.getUserType(),
            comment
        );

        return request;
    }
        closeRequest(requestId, officerId, comment = "") {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        const officer = this.findUserById(officerId);

        if (!officer) {
            throw new Error("Service Officer not found.");
        }

        if (officer.getUserType() !== "Service Officer") {
            throw new Error("Only Service Officers can close requests.");
        }

        const previousStatus = request.getStatus();

        request.closeRequest();

        request.addHistoryEntry(
            previousStatus,
            request.getStatus(),
            "Close Request",
            officerId,
            officer.getUserType(),
            comment
        );

        return request;
    }

    findRequestById(requestId) {
        return this.requests.find(
            request => request.getRequestId() === requestId
        );
    }

    getRequestsByUser(userId) {
        return this.requests.filter(
            request => request.getRequester().getUserId() === userId
        );
    }

    getAllRequests() {
        return this.requests;
    }

    updateRequest(requestId, userId, changes) {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        if (request.getRequester().getUserId() !== userId) {
            throw new Error("You can only update your own request.");
        }

        request.updateDetails(changes);

        return request;
    }

       cancelRequest(requestId, userId) {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        if (request.getRequester().getUserId() !== userId) {
            throw new Error("You can only cancel your own request.");
        }

        const previousStatus = request.getStatus();

        request.cancelRequest();

        const requester = this.findUserById(userId);

        request.addHistoryEntry(
            previousStatus,
            request.getStatus(),
            "Cancel Request",
            userId,
            requester.getUserType(),
            "Request cancelled by requester."
        );

        return request;
    }

    searchRequests(searchText) {
        const search = searchText.toLowerCase();

        return this.requests.filter(request =>
            request.getRequestId().toLowerCase().includes(search) ||
            request.getTitle().toLowerCase().includes(search)
        );
    }

    getRequestSummaryByStatus() {
        const summary = {};

        this.requests.forEach(request => {
            const status = request.getStatus();

            if (!summary[status]) {
                summary[status] = 0;
            }

            summary[status]++;
        });

        return summary;
    }

    filterRequests(filters = {}) {
        return this.requests.filter(request => {
            if (
                filters.category &&
                request.getCategory() !== filters.category
            ) {
                return false;
            }

            if (
                filters.status &&
                request.getStatus() !== filters.status
            ) {
                return false;
            }

            if (
                filters.priority &&
                request.getPriority() !== filters.priority
            ) {
                return false;
            }

            if (filters.technicianId) {
                const technician = request.getTechnician();

                if (
                    !technician ||
                    technician.getUserId() !== filters.technicianId
                ) {
                    return false;
                }
            }

            return true;
        });
    }
        sortRequests(sortBy = "dateSubmitted") {       
        const sortedRequests = [...this.requests];

        if (sortBy === "dateSubmitted") {
            return sortedRequests.sort(
                (a, b) =>
                    new Date(a.getDateSubmitted()) -
                    new Date(b.getDateSubmitted())
            );
        }

        if (sortBy === "priority") {
            const priorityOrder = {
                Urgent: 4,
                High: 3,
                Normal: 2,
                Low: 1
            };

            return sortedRequests.sort(
                (a, b) =>
                    priorityOrder[b.getPriority()] -
                    priorityOrder[a.getPriority()]
            );
        }

        throw new Error(
            "Sort option must be dateSubmitted or priority."
        );
    }
        getRequestHistory(requestId) {
        const request = this.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        return request.getRequestHistory();
    }
}

module.exports = ServiceRequestManager;