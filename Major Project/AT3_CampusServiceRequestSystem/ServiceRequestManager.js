const UserFactory = require("./UserFactory");
const ServiceRequestFactory = require("./ServiceRequestFactory");

class ServiceRequestManager {
    constructor(
        userRepository,
        serviceRequestRepository,
        requestHistoryRepository,
        auditRepository
    ) {
        this.userRepository = userRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.requestHistoryRepository = requestHistoryRepository;
        this.auditRepository = auditRepository;

        this.users = [];
        this.serviceRequests = [];
        this.requestHistory = [];
        this.auditLog = [];
    }

    // =========================================================
    // DATA LOADING
    // =========================================================

    async loadData() {
        const userData = await this.userRepository.loadAll();

        this.users = userData.map(data =>
            UserFactory.createFromData(data)
        );

        const requestData =
            await this.serviceRequestRepository.loadAll();

        this.serviceRequests = requestData.map(data =>
            ServiceRequestFactory.createFromData(data)
        );

        this.requestHistory =
            await this.requestHistoryRepository.loadAll();

        this.auditLog =
            await this.auditRepository.loadAll();
    }

    // =========================================================
    // HELPER METHODS
    // =========================================================

    getActorId(actor) {
        if (!actor) {
            return null;
        }

        if (typeof actor === "string") {
            return actor;
        }

        if (typeof actor.getUserId === "function") {
            return actor.getUserId();
        }

        if (actor.userId) {
            return actor.userId;
        }

        return null;
    }

    getActor(actor) {
        const actorId = this.getActorId(actor);

        if (!actorId) {
            return null;
        }

        return this.findUserById(actorId);
    }

    // =========================================================
    // USER METHODS
    // =========================================================

    findUserById(userId) {
        return (
            this.users.find(
                user => user.getUserId() === userId
            ) || null
        );
    }

    async registerUser(user, actor = null) {
        user.validate();

        if (this.findUserById(user.getUserId())) {
            throw new Error("User ID already exists.");
        }

        await this.userRepository.create(
            user.toData()
        );

        this.users.push(user);

        const actorObject =
            this.getActor(actor) || user;

        await this.recordAudit(
            "Register User",
            actorObject.getUserId(),
            actorObject.getUserType(),
            null,
            "Success"
        );

        return user;
    }

    async updateUser(userId, changes) {
        const user = this.findUserById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        if (changes.firstName !== undefined) {
            user.setFirstName(changes.firstName);
        }

        if (changes.lastName !== undefined) {
            user.setLastName(changes.lastName);
        }

        if (changes.email !== undefined) {
            user.setEmail(changes.email);
        }

        if (
            changes.programme !== undefined &&
            typeof user.setProgramme === "function"
        ) {
            user.setProgramme(changes.programme);
        }

        if (
            changes.yearLevel !== undefined &&
            typeof user.setYearLevel === "function"
        ) {
            user.setYearLevel(changes.yearLevel);
        }

        if (
            changes.department !== undefined &&
            typeof user.setDepartment === "function"
        ) {
            user.setDepartment(changes.department);
        }

        if (
            changes.serviceSection !== undefined &&
            typeof user.setServiceSection === "function"
        ) {
            user.setServiceSection(
                changes.serviceSection
            );
        }

        if (
            changes.technicalSpeciality !== undefined &&
            typeof user.setTechnicalSpeciality === "function"
        ) {
            user.setTechnicalSpeciality(
                changes.technicalSpeciality
            );
        }

        user.validate();

        await this.userRepository.update(
            userId,
            user.toData()
        );

        return user;
    }

    getAllUsers() {
        return [...this.users];
    }

    // =========================================================
    // REQUEST METHODS
    // =========================================================

    findRequestById(requestId) {
        return (
            this.serviceRequests.find(
                request =>
                    request.getRequestId() === requestId
            ) || null
        );
    }

    async submitRequest(request, requester) {
        request.validate();

        if (
            this.findRequestById(
                request.getRequestId()
            )
        ) {
            throw new Error(
                "Request ID already exists."
            );
        }

        const requesterId =
            this.getActorId(requester);

        const savedRequester =
            this.findUserById(requesterId);

        if (!savedRequester) {
            throw new Error("Requester not found.");
        }

        await this.serviceRequestRepository.create(
            request.toData()
        );

        this.serviceRequests.push(request);

        await this.recordHistory(
            request,
            null,
            "Submitted",
            "Submit Request",
            savedRequester.getUserId(),
            savedRequester.getUserType(),
            "Service request submitted."
        );

        await this.recordAudit(
            "Create Service Request",
            savedRequester.getUserId(),
            savedRequester.getUserType(),
            request.getRequestId(),
            "Success"
        );

        return request;
    }

    async updateRequest(
        requestId,
        requesterId,
        changes
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        if (
            request.getRequester().getUserId() !==
            requesterId
        ) {
            throw new Error(
                "Unauthorized: only the requester can update this request."
            );
        }

        if (request.getStatus() !== "Submitted") {
            throw new Error(
                "Request can only be updated while it is Submitted."
            );
        }

        request.updateDetails(
            changes.title,
            changes.description,
            changes.campusLocation
        );

        if (changes.priority !== undefined) {
            request.setPriority(
                changes.priority
            );
        }

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        return request;
    }

    async cancelRequest(
        requestId,
        requesterId
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        if (
            request.getRequester().getUserId() !==
            requesterId
        ) {
            throw new Error(
                "Unauthorized: only the requester can cancel this request."
            );
        }

        const requester =
            this.findUserById(requesterId);

        if (!requester) {
            throw new Error(
                "Requester not found."
            );
        }

        const previousStatus =
            request.getStatus();

        request.cancelRequest();

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        await this.recordHistory(
            request,
            previousStatus,
            "Cancelled",
            "Cancel Request",
            requesterId,
            requester.getUserType(),
            "Service request cancelled."
        );

        await this.recordAudit(
            "Cancel Request",
            requesterId,
            requester.getUserType(),
            requestId,
            "Success"
        );

        return request;
    }

    getAllRequests() {
        return [...this.serviceRequests];
    }

    getRequestsByRequester(requesterId) {
        return this.serviceRequests.filter(
            request =>
                request
                    .getRequester()
                    .getUserId() === requesterId
        );
    }

    getRequestsByTechnician(technicianId) {
        return this.serviceRequests.filter(
            request =>
                request.getTechnician() &&
                request
                    .getTechnician()
                    .getUserId() === technicianId
        );
    }

    // =========================================================
    // SEARCH
    // =========================================================

    searchRequests(criteria = {}) {
        let results = [
            ...this.serviceRequests
        ];

        if (criteria.keyword) {
            const keyword =
                criteria.keyword.toLowerCase();

            results = results.filter(request => {
                const searchableText = [
                    request.getRequestId(),
                    request.getTitle(),
                    request.getDescription(),
                    request.getCampusLocation(),
                    request.getCategory(),
                    request.getPriority(),
                    request.getStatus(),
                    request
                        .getRequester()
                        .getFullName()
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    keyword
                );
            });
        }

        if (criteria.requesterId) {
            results = results.filter(
                request =>
                    request
                        .getRequester()
                        .getUserId() ===
                    criteria.requesterId
            );
        }

        if (criteria.technicianId) {
            results = results.filter(
                request =>
                    request.getTechnician() &&
                    request
                        .getTechnician()
                        .getUserId() ===
                    criteria.technicianId
            );
        }

        if (criteria.category) {
            results = results.filter(
                request =>
                    request.getCategory() ===
                    criteria.category
            );
        }

        if (criteria.priority) {
            results = results.filter(
                request =>
                    request.getPriority() ===
                    criteria.priority
            );
        }

        if (criteria.status) {
            results = results.filter(
                request =>
                    request.getStatus() ===
                    criteria.status
            );
        }

        if (criteria.location) {
            results = results.filter(
                request =>
                    request
                        .getCampusLocation()
                        .toLowerCase() ===
                    criteria.location.toLowerCase()
            );
        }

        if (criteria.sortBy === "priority") {
            results.sort(
                (a, b) =>
                    b.calculatePriorityScore() -
                    a.calculatePriorityScore()
            );
        }

        if (criteria.sortBy === "date") {
            results.sort(
                (a, b) =>
                    new Date(
                        b.getDateSubmitted()
                    ) -
                    new Date(
                        a.getDateSubmitted()
                    )
            );
        }

        return results;
    }

    // =========================================================
    // REVIEW
    // =========================================================

    async reviewRequest(
        requestId,
        officerId,
        comment = "Request reviewed and approved."
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        const officer =
            this.findUserById(officerId);

        if (!officer) {
            throw new Error(
                "Service Officer not found."
            );
        }

        if (
            officer.getUserType() !==
            "Service Officer"
        ) {
            throw new Error(
                "Only a Service Officer can review requests."
            );
        }

        const previousStatus =
            request.getStatus();

        request.reviewRequest();

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        await this.recordHistory(
            request,
            previousStatus,
            request.getStatus(),
            "Review Request",
            officerId,
            officer.getUserType(),
            comment
        );

        await this.recordAudit(
            "Review Request",
            officerId,
            officer.getUserType(),
            requestId,
            "Success"
        );

        return request;
    }

    // =========================================================
    // CHANGE PRIORITY
    // =========================================================

    async changePriority(
        requestId,
        priority,
        actorId
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        const actor =
            this.findUserById(actorId);

        if (!actor) {
            throw new Error(
                "User not found."
            );
        }

        if (
            actor.getUserType() !==
                "Service Officer" &&
            actor.getUserType() !==
                "System Administrator"
        ) {
            throw new Error(
                "Only a Service Officer or System Administrator can change priority."
            );
        }

        request.setPriority(priority);

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        await this.recordAudit(
            "Change Priority",
            actorId,
            actor.getUserType(),
            requestId,
            "Success"
        );

        return request;
    }

    // =========================================================
    // ASSIGN TECHNICIAN
    // =========================================================

    async assignTechnician(
        requestId,
        technician,
        officerId
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        const officer =
            this.findUserById(officerId);

        if (!officer) {
            throw new Error(
                "Service Officer not found."
            );
        }

        if (
            officer.getUserType() !==
            "Service Officer"
        ) {
            throw new Error(
                "Only a Service Officer can assign technicians."
            );
        }

        if (!technician) {
            throw new Error(
                "Technician not found."
            );
        }

        const technicianId =
            this.getActorId(technician);

        const savedTechnician =
            this.findUserById(technicianId);

        if (!savedTechnician) {
            throw new Error(
                "Technician not found."
            );
        }

        if (
            savedTechnician.getUserType() !==
            "Technician"
        ) {
            throw new Error(
                "Selected user is not a Technician."
            );
        }

        const previousStatus =
            request.getStatus();

        request.assignTechnician(
            savedTechnician
        );

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        await this.recordHistory(
            request,
            previousStatus,
            request.getStatus(),
            "Assign Technician",
            officerId,
            officer.getUserType(),
            `Technician ${technicianId} assigned.`
        );

        await this.recordAudit(
            "Assign Technician",
            officerId,
            officer.getUserType(),
            requestId,
            "Success"
        );

        return request;
    }

    // =========================================================
    // START WORK
    // =========================================================

    async startWork(
        requestId,
        technicianId
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        const technician =
            this.findUserById(technicianId);

        if (!technician) {
            throw new Error(
                "Technician not found."
            );
        }

        if (
            technician.getUserType() !==
            "Technician"
        ) {
            throw new Error(
                "Only a Technician can start work."
            );
        }

        if (
            !request.getTechnician() ||
            request
                .getTechnician()
                .getUserId() !==
                technicianId
        ) {
            throw new Error(
                "Unauthorized: this technician is not assigned to the request."
            );
        }

        const previousStatus =
            request.getStatus();

        request.startWork();

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        await this.recordHistory(
            request,
            previousStatus,
            request.getStatus(),
            "Start Work",
            technicianId,
            technician.getUserType(),
            "Technician started work."
        );

        await this.recordAudit(
            "Start Work",
            technicianId,
            technician.getUserType(),
            requestId,
            "Success"
        );

        return request;
    }

    // =========================================================
    // RESOLVE REQUEST
    // =========================================================

    async resolveRequest(
        requestId,
        technicianId,
        comment = ""
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        const technician =
            this.findUserById(technicianId);

        if (!technician) {
            throw new Error(
                "Technician not found."
            );
        }

        if (
            technician.getUserType() !==
            "Technician"
        ) {
            throw new Error(
                "Only a Technician can resolve requests."
            );
        }

        if (
            !request.getTechnician() ||
            request
                .getTechnician()
                .getUserId() !==
                technicianId
        ) {
            throw new Error(
                "Unauthorized: this technician is not assigned to the request."
            );
        }

        const previousStatus =
            request.getStatus();

        request.resolveRequest();

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        await this.recordHistory(
            request,
            previousStatus,
            request.getStatus(),
            "Resolve Request",
            technicianId,
            technician.getUserType(),
            comment
        );

        await this.recordAudit(
            "Resolve Request",
            technicianId,
            technician.getUserType(),
            requestId,
            "Success"
        );

        return request;
    }

    // =========================================================
    // CLOSE REQUEST
    // =========================================================

    async closeRequest(
        requestId,
        officerId,
        comment = "Request closed."
    ) {
        const request =
            this.findRequestById(requestId);

        if (!request) {
            throw new Error(
                "Service request not found."
            );
        }

        const officer =
            this.findUserById(officerId);

        if (!officer) {
            throw new Error(
                "Service Officer not found."
            );
        }

        if (
            officer.getUserType() !==
            "Service Officer"
        ) {
            throw new Error(
                "Only a Service Officer can close requests."
            );
        }

        const previousStatus =
            request.getStatus();

        request.closeRequest();

        await this.serviceRequestRepository.update(
            requestId,
            request.toData()
        );

        await this.recordHistory(
            request,
            previousStatus,
            request.getStatus(),
            "Close Request",
            officerId,
            officer.getUserType(),
            comment
        );

        await this.recordAudit(
            "Close Request",
            officerId,
            officer.getUserType(),
            requestId,
            "Success"
        );

        return request;
    }

    // =========================================================
    // REQUEST HISTORY
    // =========================================================

    async recordHistory(
        request,
        previousStatus,
        newStatus,
        action,
        actorId,
        actorRole,
        comment = ""
    ) {
        const entry = {
            requestId:
                request.getRequestId(),
            previousStatus,
            newStatus,
            action,
            actorId,
            actorRole,
            comment,
            dateTime:
                new Date().toISOString()
        };

        this.requestHistory.push(entry);

        await this.requestHistoryRepository.saveAll(
            this.requestHistory
        );

        return entry;
    }

    getRequestHistory(requestId) {
        return this.requestHistory.filter(
            entry =>
                entry.requestId === requestId
        );
    }

    // =========================================================
    // AUDIT
    // =========================================================

    async recordAudit(
        action,
        actorId,
        actorRole,
        requestId = null,
        outcome = "Success"
    ) {
        const entry = {
            dateTime:
                new Date().toISOString(),
            action,
            actorId,
            actorRole,
            requestId,
            outcome
        };

        this.auditLog.push(entry);

        await this.auditRepository.saveAll(
            this.auditLog
        );

        return entry;
    }

    getAuditLog() {
        return [...this.auditLog];
    }

    // =========================================================
    // REPORT 1
    // REQUESTS BY CATEGORY
    // =========================================================

    getRequestSummaryByCategory() {
        const report = {};

        for (const request of this.serviceRequests) {
            const category =
                request.getCategory();

            report[category] =
                (report[category] || 0) + 1;
        }

        return report;
    }

    // =========================================================
    // REPORT 2
    // REQUESTS BY PRIORITY
    // =========================================================

    getRequestSummaryByPriority() {
        const report = {};

        for (const request of this.serviceRequests) {
            const priority =
                request.getPriority();

            report[priority] =
                (report[priority] || 0) + 1;
        }

        return report;
    }

    // =========================================================
    // REPORT 3
    // URGENT REQUESTS
    // =========================================================

    getUrgentRequests() {
        return this.serviceRequests.filter(
            request =>
                request.getPriority() ===
                "Urgent"
        );
    }

    // =========================================================
    // REPORT 4
    // REQUESTS BY TECHNICIAN
    // =========================================================

    getRequestsByTechnician() {
        const report = {};

        for (const request of this.serviceRequests) {
            const technician =
                request.getTechnician();

            if (!technician) {
                continue;
            }

            const technicianId =
                technician.getUserId();

            report[technicianId] =
                (report[technicianId] || 0) + 1;
        }

        return report;
    }

    // =========================================================
    // REPORT 5
    // COMPLETED REQUESTS BY TECHNICIAN
    // =========================================================

    getCompletedRequestsByTechnician() {
        const report = {};

        const completedStatuses = [
            "Resolved",
            "Closed"
        ];

        for (const request of this.serviceRequests) {
            const technician =
                request.getTechnician();

            if (
                !technician ||
                !completedStatuses.includes(
                    request.getStatus()
                )
            ) {
                continue;
            }

            const technicianId =
                technician.getUserId();

            report[technicianId] =
                (report[technicianId] || 0) + 1;
        }

        return report;
    }

    // =========================================================
    // REPORT 6
    // REQUEST VOLUME BY LOCATION
    // =========================================================

    getRequestVolumeByLocation() {
        const report = {};

        for (const request of this.serviceRequests) {
            const location =
                request.getCampusLocation();

            report[location] =
                (report[location] || 0) + 1;
        }

        return report;
    }

    // =========================================================
    // REPORT 7
    // AVERAGE RESOLUTION TIME
    // =========================================================

    getAverageResolutionTimeHours() {
        const completedRequests =
            this.serviceRequests.filter(
                request =>
                    request.getStatus() ===
                        "Resolved" ||
                    request.getStatus() ===
                        "Closed"
            );

        if (
            completedRequests.length === 0
        ) {
            return 0;
        }

        let totalHours = 0;
        let count = 0;

        for (const request of completedRequests) {
            const history =
                this.getRequestHistory(
                    request.getRequestId()
                );

            const submittedEntry =
                history.find(
                    entry =>
                        entry.newStatus ===
                        "Submitted"
                );

            const resolvedEntry =
                history.find(
                    entry =>
                        entry.newStatus ===
                        "Resolved"
                );

            if (
                submittedEntry &&
                resolvedEntry
            ) {
                const start =
                    new Date(
                        submittedEntry.dateTime
                    );

                const end =
                    new Date(
                        resolvedEntry.dateTime
                    );

                const hours =
                    (end - start) /
                    (1000 * 60 * 60);

                if (hours >= 0) {
                    totalHours += hours;
                    count++;
                }
            }
        }

        if (count === 0) {
            return 0;
        }

        return totalHours / count;
    }

    // =========================================================
    // REPORT 8
    // OVERDUE REQUESTS
    // =========================================================

    getOverdueRequests() {
        const now = new Date();

        return this.serviceRequests.filter(
            request => {
                const status =
                    request.getStatus();

                if (
                    status === "Closed" ||
                    status === "Cancelled"
                ) {
                    return false;
                }

                const submitted =
                    new Date(
                        request.getDateSubmitted()
                    );

                const elapsedHours =
                    (now - submitted) /
                    (1000 * 60 * 60);

                const targetHours =
                    request.getTargetResolutionHours();

                return (
                    elapsedHours >
                    targetHours
                );
            }
        );
    }

    // =========================================================
    // REPORT 9
    // PRIORITY SCORE REPORT
    // =========================================================

    getPriorityScoreReport() {
        return this.serviceRequests
            .map(request => ({
                requestId:
                    request.getRequestId(),

                category:
                    request.getCategory(),

                priority:
                    request.getPriority(),

                priorityScore:
                    request.calculatePriorityScore(),

                targetResolutionHours:
                    request.getTargetResolutionHours(),

                status:
                    request.getStatus()
            }))
            .sort(
                (a, b) =>
                    b.priorityScore -
                    a.priorityScore
            );
    }

    // =========================================================
    // REPORT 10
    // DASHBOARD REPORT
    // =========================================================

    getDashboardReport() {
        const summary = {
            totalRequests:
                this.serviceRequests.length,

            submitted: 0,
            reviewed: 0,
            assigned: 0,
            inProgress: 0,
            resolved: 0,
            closed: 0,
            cancelled: 0,

            totalUsers:
                this.users.length,

            students: 0,
            staff: 0,
            serviceOfficers: 0,
            technicians: 0,

            urgentRequests:
                this.getUrgentRequests().length,

            overdueRequests:
                this.getOverdueRequests().length,

            averageResolutionTimeHours:
                this.getAverageResolutionTimeHours()
        };

        for (const request of this.serviceRequests) {
            switch (request.getStatus()) {
                case "Submitted":
                    summary.submitted++;
                    break;

                case "Reviewed":
                    summary.reviewed++;
                    break;

                case "Assigned":
                    summary.assigned++;
                    break;

                case "In Progress":
                    summary.inProgress++;
                    break;

                case "Resolved":
                    summary.resolved++;
                    break;

                case "Closed":
                    summary.closed++;
                    break;

                case "Cancelled":
                    summary.cancelled++;
                    break;
            }
        }

        for (const user of this.users) {
            switch (user.getUserType()) {
                case "Student":
                    summary.students++;
                    break;

                case "Staff":
                    summary.staff++;
                    break;

                case "Service Officer":
                    summary.serviceOfficers++;
                    break;

                case "Technician":
                    summary.technicians++;
                    break;
            }
        }

        return summary;
    }
}

module.exports = ServiceRequestManager;