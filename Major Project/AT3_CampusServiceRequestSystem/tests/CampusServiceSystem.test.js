const test = require("node:test");
const assert = require("node:assert/strict");

const UserFactory = require("../UserFactory");
const ServiceRequestFactory = require("../ServiceRequestFactory");
const StudentRequester = require("../StudentRequester");
const StaffRequester = require("../StaffRequester");
const ServiceOfficer = require("../ServiceOfficer");
const Technician = require("../Technician");

const ICTSupportRequest = require("../ICTSupportRequest");
const MaintenanceRequest = require("../MaintenanceRequest");
const CleaningRequest = require("../CleaningRequest");
const GeneralCampusServiceRequest = require("../GeneralCampusServiceRequest");

// ============================================================
// TEST DATA
// ============================================================

function createStudent() {
    return new StudentRequester(
        "STU100",
        "Test",
        "Student",
        "test.student@example.com",
        "Bachelor of Information Systems",
        3
    );
}

function createStaff() {
    return new StaffRequester(
        "STF100",
        "Test",
        "Staff",
        "test.staff@example.com",
        "Administration"
    );
}

function createOfficer() {
    return new ServiceOfficer(
        "OFF100",
        "Test",
        "Officer",
        "test.officer@example.com",
        "Campus Services"
    );
}

function createTechnician() {
    return new Technician(
        "TECH100",
        "Test",
        "Technician",
        "test.technician@example.com",
        "General Maintenance"
    );
}

function createGeneralRequest() {
    return new GeneralCampusServiceRequest(
        "REQ100",
        createStudent(),
        "Test Service Request",
        "This is a test service request.",
        "Main Campus",
        "Normal",
        "General Information Service",
        "Testing system functionality."
    );
}

// ============================================================
// USER TESTS
// ============================================================

test("1. Student requester can be created successfully", () => {
    const student = createStudent();

    assert.equal(student.getUserId(), "STU100");
    assert.equal(student.getUserType(), "Student");
    assert.equal(student.getFullName(), "Test Student");
});

test("2. Staff requester can be created successfully", () => {
    const staff = createStaff();

    assert.equal(staff.getUserId(), "STF100");
    assert.equal(staff.getUserType(), "Staff");
});

test("3. Service officer can be created successfully", () => {
    const officer = createOfficer();

    assert.equal(officer.getUserId(), "OFF100");
    assert.equal(officer.getUserType(), "Service Officer");
});

test("4. Technician can be created successfully", () => {
    const technician = createTechnician();

    assert.equal(technician.getUserId(), "TECH100");
    assert.equal(technician.getUserType(), "Technician");
});

// ============================================================
// USER VALIDATION TESTS
// ============================================================

test("5. Invalid email address is rejected", () => {
    const student = new StudentRequester(
        "STU101",
        "Invalid",
        "Email",
        "invalid-email",
        "Bachelor of Information Systems",
        3
    );

    assert.throws(
        () => student.validate(),
        /email/i
    );
});

test("6. Missing user ID is rejected", () => {
    const student = new StudentRequester(
        "",
        "Test",
        "Student",
        "test@example.com",
        "Bachelor of Information Systems",
        3
    );

    assert.throws(
        () => student.validate(),
        /user id/i
    );
});
// ============================================================
// REQUEST CREATION TESTS
// ============================================================

test("7. General campus service request can be created", () => {
    const request = createGeneralRequest();

    assert.equal(request.getRequestId(), "REQ100");
    assert.equal(request.getCategory(), "General Campus Service");
    assert.equal(request.getPriority(), "Normal");
    assert.equal(request.getStatus(), "Submitted");
});

test("8. Missing request title is rejected", () => {
    assert.throws(
        () => {
            new GeneralCampusServiceRequest(
                "REQ101",
                createStudent(),
                "",
                "Description",
                "Main Campus",
                "Normal",
                "General Information Service"
            );
        },
        /title/i
    );
});

test("9. Invalid request priority is rejected", () => {
    assert.throws(
        () => {
            new GeneralCampusServiceRequest(
                "REQ102",
                createStudent(),
                "Test Request",
                "Description",
                "Main Campus",
                "Invalid Priority",
                "General Information Service"
            );
        },
        /priority/i
    );
});

// ============================================================
// SPECIALISED REQUEST TESTS
// ============================================================

// ============================================================
// SPECIALISED REQUEST TESTS
// ============================================================

test("10. ICT support request validates correctly", () => {
    const request = new ICTSupportRequest(
        "ICT100",
        createStudent(),
        "Computer problem",
        "Computer will not start.",
        "ICT Lab",
        "ICT Support",
        "High",
        "Desktop Computer",
        "Student Portal",
        "Hardware Failure",
        "High"
    );

    assert.equal(request.getCategory(), "ICT Support");
    assert.equal(request.getPriority(), "High");
    assert.equal(request.calculatePriorityScore(), 5);

    assert.equal(request.validate(), true);
});

test("11. Maintenance request validates correctly", () => {
    const request = new MaintenanceRequest(
        "MAIN100",
        createStudent(),
        "Broken equipment",
        "Equipment needs repair.",
        "Main Campus",
        "Facilities Maintenance",
        "High",
        "Administration Block",
        "Room 101",
        "Medium",
        "Door"
    );

    assert.equal(request.getCategory(), "Facilities Maintenance");
    assert.equal(request.getPriority(), "High");
    assert.equal(request.getTargetResolutionHours(), 24);

    assert.equal(request.validate(), true);
});

test("12. Cleaning request validates correctly", () => {
    const request = new CleaningRequest(
        "CLEAN100",
        createStudent(),
        "Room cleaning",
        "Room requires cleaning.",
        "Main Campus",
        "Cleaning and Sanitation",
        "Normal",
        "Lecture Room",
        "Medium",
        "Routine Cleaning",
        "Afternoon"
    );

    assert.equal(request.getCategory(), "Cleaning and Sanitation");
    assert.equal(request.getPriority(), "Normal");
    assert.equal(request.getTargetResolutionHours(), 24);

    assert.equal(request.validate(), true);
});
// ============================================================
// POLYMORPHISM TEST
// ============================================================

test("13. Different request types support polymorphic methods", () => {
    const requests = [
        new ICTSupportRequest(
            "ICT101",
            createStudent(),
            "Network problem",
            "Network unavailable.",
            "ICT Lab",
            "Urgent",
            "Router",
            "Campus Network",
            "Network Failure",
            "High"
        ),

        new MaintenanceRequest(
            "MAIN101",
            createStudent(),
            "Broken equipment",
            "Equipment needs repair.",
            "Science Block",
            "High",
            "Science Block",
            "Room 2",
            "High",
            "Equipment"
        ),

        new CleaningRequest(
            "CLEAN101",
            createStudent(),
            "Sanitation issue",
            "Area requires sanitation.",
            "Main Campus",
            "Urgent",
            "Restroom",
            "High",
            "Sanitation",
            "Morning"
        )
    ];

    for (const request of requests) {
        assert.equal(typeof request.calculatePriorityScore, "function");
        assert.equal(typeof request.getTargetResolutionHours, "function");
        assert.equal(typeof request.getRequestSummary, "function");
    }
});

// ============================================================
// WORKFLOW TESTS
// ============================================================

test("14. Request follows the correct workflow", () => {
    const request = createGeneralRequest();
    const technician = createTechnician();

    assert.equal(request.getStatus(), "Submitted");

    request.reviewRequest(createOfficer());

    assert.equal(request.getStatus(), "Reviewed");

    request.assignTechnician(technician);

    assert.equal(request.getStatus(), "Assigned");

    request.startWork();

    assert.equal(request.getStatus(), "In Progress");

    request.resolveRequest();

    assert.equal(request.getStatus(), "Resolved");

    request.closeRequest();

    assert.equal(request.getStatus(), "Closed");
});

test("15. Request cancellation works from Submitted status", () => {
    const request = new GeneralCampusServiceRequest(
        "REQ103",
        createStudent(),
        "Cancel Test",
        "This request will be cancelled.",
        "Main Campus",
        "Normal",
        "General Information Service"
    );

    request.cancelRequest();

    assert.equal(request.getStatus(), "Cancelled");
});

test("16. Cancelled request cannot be cancelled again", () => {
    const request = new GeneralCampusServiceRequest(
        "REQ104",
        createStudent(),
        "Cancel Test",
        "This request will be cancelled.",
        "Main Campus",
        "Normal",
        "General Information Service"
    );

    request.cancelRequest();

    assert.throws(
        () => request.cancelRequest(),
        /cancel/i
    );
});

// ============================================================
// HISTORY TEST
// ============================================================

test("17. Request history records history entries correctly", () => {
    const request = createGeneralRequest();

    assert.equal(request.getRequestHistory().length, 0);

    request.addHistoryEntry(
        "Submitted",
        "Reviewed",
        "Review Request",
        "OFF100",
        "Service Officer",
        "Request reviewed and approved."
    );

    request.addHistoryEntry(
        "Reviewed",
        "Assigned",
        "Assign Technician",
        "OFF100",
        "Service Officer",
        "Technician assigned."
    );

    request.addHistoryEntry(
        "Assigned",
        "In Progress",
        "Start Work",
        "TECH100",
        "Technician",
        "Technician started work."
    );

    request.addHistoryEntry(
        "In Progress",
        "Resolved",
        "Resolve Request",
        "TECH100",
        "Technician",
        "Request resolved."
    );

    request.addHistoryEntry(
        "Resolved",
        "Closed",
        "Close Request",
        "OFF100",
        "Service Officer",
        "Request closed."
    );

    const history = request.getRequestHistory();

    assert.equal(history.length, 5);
    assert.equal(history[0].previousStatus, "Submitted");
    assert.equal(history[0].newStatus, "Reviewed");
    assert.equal(history[4].newStatus, "Closed");
});

// ============================================================
// FACTORY TESTS
// ============================================================

test("18. UserFactory restores a student from saved data", () => {
    const student = createStudent();
    const savedData = student.toData();

    const restored = UserFactory.createFromData(savedData);

    assert.equal(restored.getUserId(), "STU100");
    assert.equal(restored.getUserType(), "Student");
});

test("19. ServiceRequestFactory restores a request from saved data", () => {
    const request = createGeneralRequest();

    const savedData = request.toData();

    const restored = ServiceRequestFactory.createFromData(savedData);

    assert.equal(restored.getRequestId(), "REQ100");
    assert.equal(restored.getCategory(), "General Campus Service");
    assert.equal(restored.getPriority(), "Normal");
});

// ============================================================
// ABSTRACT-STYLE METHOD TEST
// ============================================================

test("20. Base ServiceRequest abstract-style methods throw errors", () => {
    const ServiceRequest = require("../ServiceRequest");

    const request = new ServiceRequest(
        "BASE100",
        createStudent(),
        "Base Request",
        "Base request description",
        "Main Campus",
        "General Campus Service",
        "Normal"
    );

    assert.throws(
        () => request.calculatePriorityScore(),
        /implemented/i
    );

    assert.throws(
        () => request.getTargetResolutionHours(),
        /implemented/i
    );

    assert.throws(
        () => request.getRequestSummary(),
        /implemented/i
    );
});