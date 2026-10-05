const readline = require("readline");

const User = require("./User");
const StudentRequester = require("./StudentRequester");
const StaffRequester = require("./StaffRequester");
const ServiceOfficer = require("./ServiceOfficer");
const Technician = require("./Technician");

const ICTSupportRequest = require("./ICTSupportRequest");
const MaintenanceRequest = require("./MaintenanceRequest");
const CleaningRequest = require("./CleaningRequest");
const GeneralCampusServiceRequest = require("./GeneralCampusServiceRequest");

const ServiceRequestManager = require("./ServiceRequestManager");

const UserFileRepository = require("./repositories/UserFileRepository");
const ServiceRequestFileRepository = require("./repositories/ServiceRequestFileRepository");
const RequestHistoryFileRepository = require("./repositories/RequestHistoryFileRepository");
const AuditFileRepository = require("./repositories/AuditFileRepository");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const userRepository = new UserFileRepository();
const serviceRequestRepository = new ServiceRequestFileRepository();
const requestHistoryRepository = new RequestHistoryFileRepository();
const auditRepository = new AuditFileRepository();

const manager = new ServiceRequestManager(
    userRepository,
    serviceRequestRepository,
    requestHistoryRepository,
    auditRepository
);

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

function printHeader(title) {
    console.log("\n========================================");
    console.log(` ${title}`);
    console.log("========================================");
}

function printRequest(request) {
    console.log("\n----------------------------------------");
    console.log(`Request ID: ${request.getRequestId()}`);
    console.log(`Requester: ${request.getRequester().getFullName()}`);
    console.log(`Title: ${request.getTitle()}`);
    console.log(`Description: ${request.getDescription()}`);
    console.log(`Location: ${request.getCampusLocation()}`);
    console.log(`Category: ${request.getCategory()}`);
    console.log(`Priority: ${request.getPriority()}`);
    console.log(`Status: ${request.getStatus()}`);
    console.log(`Date Submitted: ${request.getDateSubmitted()}`);
    console.log(`Last Updated: ${request.getDateUpdated()}`);

    if (request.getTechnician()) {
        console.log(
            `Technician: ${request.getTechnician().getFullName()}`
        );
    } else {
        console.log("Technician: Not assigned");
    }

    if (request.getServiceType) {
        console.log(`Service Type: ${request.getServiceType()}`);
    }

    if (request.getDeviceType) {
        console.log(`Device Type: ${request.getDeviceType()}`);
    }

    if (request.getSystemName) {
        console.log(`System Name: ${request.getSystemName()}`);
    }

    if (request.getFaultType) {
        console.log(`Fault Type: ${request.getFaultType()}`);
    }

    if (request.getNetworkImpact) {
        console.log(`Network Impact: ${request.getNetworkImpact()}`);
    }

    if (request.getBuilding) {
        console.log(`Building: ${request.getBuilding()}`);
    }

    if (request.getRoomNumber) {
        console.log(`Room Number: ${request.getRoomNumber()}`);
    }

    if (request.getHazardLevel) {
        console.log(`Hazard Level: ${request.getHazardLevel()}`);
    }

    if (request.getEquipmentAffected) {
        console.log(
            `Equipment Affected: ${request.getEquipmentAffected()}`
        );
    }

    if (request.getCleaningArea) {
        console.log(`Cleaning Area: ${request.getCleaningArea()}`);
    }

    if (request.getHygieneRisk) {
        console.log(`Hygiene Risk: ${request.getHygieneRisk()}`);
    }

    if (request.getPreferredServiceTime) {
        console.log(
            `Preferred Service Time: ${request.getPreferredServiceTime()}`
        );
    }

    if (request.getAdditionalDetails) {
        console.log(
            `Additional Details: ${request.getAdditionalDetails()}`
        );
    }

    console.log("----------------------------------------");
}

function printRequests(requests) {
    if (!requests || requests.length === 0) {
        console.log("\nNo service requests found.");
        return;
    }

    requests.forEach((request) => {
        printRequest(request);
    });
}

async function registerUser() {
    printHeader("REGISTER USER");

    try {
        const userId = await askQuestion("User ID: ");
        const firstName = await askQuestion("First Name: ");
        const lastName = await askQuestion("Last Name: ");
        const email = await askQuestion("Email: ");

        console.log("\nUser Types:");
        console.log("1. Student");
        console.log("2. Staff");
        console.log("3. Service Officer");
        console.log("4. Technician");

        const typeChoice = await askQuestion("Choose user type (1-4): ");

        let user;

        switch (typeChoice) {
            case "1": {
                const programme = await askQuestion("Programme: ");
                const yearLevel = await askQuestion("Year Level: ");

                user = new StudentRequester(
                    userId,
                    firstName,
                    lastName,
                    email,
                    programme,
                    yearLevel
                );
                break;
            }

            case "2": {
                const department = await askQuestion("Department: ");

                user = new StaffRequester(
                    userId,
                    firstName,
                    lastName,
                    email,
                    department
                );
                break;
            }

            case "3": {
                const serviceSection = await askQuestion(
                    "Service Section: "
                );

                user = new ServiceOfficer(
                    userId,
                    firstName,
                    lastName,
                    email,
                    serviceSection
                );
                break;
            }

            case "4": {
                const technicalSpeciality = await askQuestion(
                    "Technical Speciality: "
                );

                user = new Technician(
                    userId,
                    firstName,
                    lastName,
                    email,
                    technicalSpeciality
                );
                break;
            }

            default:
                throw new Error("Invalid user type.");
        }

        await manager.registerUser(user, user);

        console.log("\nUser registered successfully.");
        console.log(user.displayInfo());

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function submitRequest() {
    printHeader("SUBMIT SERVICE REQUEST");

    try {
        const requesterId = await askQuestion("Requester User ID: ");

        const requester = manager.findUserById(requesterId);

        if (!requester) {
            throw new Error("Requester not found.");
        }

        const requestId = await askQuestion("Request ID: ");
        const title = await askQuestion("Title: ");
        const description = await askQuestion("Description: ");
        const campusLocation = await askQuestion("Campus Location: ");

        console.log("\nService Categories:");
        console.log("1. ICT Support");
        console.log("2. Facilities Maintenance");
        console.log("3. Cleaning and Sanitation");
        console.log("4. General Campus Service");

        const categoryChoice = await askQuestion(
            "Choose category (1-4): "
        );

        console.log("\nPriority:");
        console.log("1. Low");
        console.log("2. Normal");
        console.log("3. High");
        console.log("4. Urgent");

        const priorityChoice = await askQuestion(
            "Choose priority (1-4): "
        );

        const priorityMap = {
            "1": "Low",
            "2": "Normal",
            "3": "High",
            "4": "Urgent"
        };

        const priority = priorityMap[priorityChoice];

        if (!priority) {
            throw new Error("Invalid priority.");
        }

        let request;

        switch (categoryChoice) {
            case "1": {
                const deviceType = await askQuestion("Device Type: ");
                const systemName = await askQuestion("System Name: ");
                const faultType = await askQuestion("Fault Type: ");
                const networkImpact = await askQuestion(
                    "Network Impact (Low/Medium/High): "
                );

                request = new ICTSupportRequest(
                    requestId,
                    requester,
                    title,
                    description,
                    campusLocation,
                    priority,
                    deviceType,
                    systemName,
                    faultType,
                    networkImpact
                );

                break;
            }

            case "2": {
                const building = await askQuestion("Building: ");
                const roomNumber = await askQuestion("Room Number: ");
                const hazardLevel = await askQuestion(
                    "Hazard Level (Low/Medium/High): "
                );
                const equipmentAffected = await askQuestion(
                    "Equipment Affected: "
                );

                request = new MaintenanceRequest(
                    requestId,
                    requester,
                    title,
                    description,
                    campusLocation,
                    priority,
                    building,
                    roomNumber,
                    hazardLevel,
                    equipmentAffected
                );

                break;
            }

            case "3": {
                const cleaningArea = await askQuestion("Cleaning Area: ");
                const hygieneRisk = await askQuestion(
                    "Hygiene Risk (Low/Medium/High): "
                );
                const serviceType = await askQuestion(
                    "Service Type (Routine Cleaning/Deep Cleaning/Sanitation): "
                );
                const preferredServiceTime = await askQuestion(
                    "Preferred Service Time: "
                );

                request = new CleaningRequest(
                    requestId,
                    requester,
                    title,
                    description,
                    campusLocation,
                    priority,
                    cleaningArea,
                    hygieneRisk,
                    serviceType,
                    preferredServiceTime
                );

                break;
            }

            case "4": {
                const serviceType = await askQuestion("Service Type: ");
                const additionalDetails = await askQuestion(
                    "Additional Details: "
                );

                request = new GeneralCampusServiceRequest(
                    requestId,
                    requester,
                    title,
                    description,
                    campusLocation,
                    priority,
                    serviceType,
                    additionalDetails
                );

                break;
            }

            default:
                throw new Error("Invalid service category.");
        }

        await manager.submitRequest(request, requester);

        console.log("\nService request submitted successfully.");
        printRequest(request);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewRequest() {
    printHeader("VIEW REQUEST");

    try {
        const requestId = await askQuestion("Request ID: ");
        const request = manager.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        printRequest(request);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewMyRequests() {
    printHeader("VIEW MY REQUESTS");

    try {
        const userId = await askQuestion("User ID: ");

        const requests = manager.searchRequests({
            requesterId: userId
        });

        printRequests(requests);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewAllRequests() {
    printHeader("VIEW ALL REQUESTS");

    try {
        const requests = manager.getAllRequests();
        printRequests(requests);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function updateRequest() {
    printHeader("UPDATE MY REQUEST");

    try {
        const requesterId = await askQuestion("Requester User ID: ");
        const requestId = await askQuestion("Request ID: ");

        const request = manager.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        const title = await askQuestion(
            `New Title (${request.getTitle()}): `
        );

        const description = await askQuestion(
            `New Description (${request.getDescription()}): `
        );

        const campusLocation = await askQuestion(
            `New Location (${request.getCampusLocation()}): `
        );

        const priority = await askQuestion(
            `New Priority (${request.getPriority()}): `
        );

        const updateData = {};

        if (title) {
            updateData.title = title;
        }

        if (description) {
            updateData.description = description;
        }

        if (campusLocation) {
            updateData.campusLocation = campusLocation;
        }

        if (priority) {
            updateData.priority = priority;
        }

        await manager.updateRequest(
            requestId,
            requesterId,
            updateData
        );

        console.log("\nRequest updated successfully.");

        const updatedRequest = manager.findRequestById(requestId);
        printRequest(updatedRequest);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function cancelRequest() {
    printHeader("CANCEL REQUEST");

    try {
        const requesterId = await askQuestion("Requester User ID: ");
        const requestId = await askQuestion("Request ID: ");

        await manager.cancelRequest(
            requestId,
            requesterId
        );

        console.log("\nRequest cancelled successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function searchRequests() {
    printHeader("SEARCH REQUESTS");

    try {
        const keyword = await askQuestion(
            "Search keyword (press Enter to skip): "
        );

        const category = await askQuestion(
            "Category (press Enter to skip): "
        );

        const priority = await askQuestion(
            "Priority (press Enter to skip): "
        );

        const status = await askQuestion(
            "Status (press Enter to skip): "
        );

        const location = await askQuestion(
            "Location (press Enter to skip): "
        );

        const requests = manager.searchRequests({
            keyword: keyword || undefined,
            category: category || undefined,
            priority: priority || undefined,
            status: status || undefined,
            location: location || undefined
        });

        printRequests(requests);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewSummary() {
    printHeader("REQUEST SUMMARY");

    try {
        const summary = manager.getDashboardReport();

        console.log("\nTotal Requests:");
        console.log(summary.totalRequests);

        console.log("\nBy Category:");
        console.table(summary.byCategory);

        console.log("\nBy Priority:");
        console.table(summary.byPriority);

        console.log("\nBy Status:");
        console.table(summary.byStatus);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function reviewRequest() {
    printHeader("REVIEW REQUEST");

    try {
        const officerId = await askQuestion("Service Officer ID: ");
        const requestId = await askQuestion("Request ID: ");
        const comment = await askQuestion("Review Comment: ");

        await manager.reviewRequest(
            requestId,
            officerId,
            comment
        );

        console.log("\nRequest reviewed successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function changePriority() {
    printHeader("CHANGE REQUEST PRIORITY");

    try {
        const officerId = await askQuestion("Service Officer ID: ");
        const requestId = await askQuestion("Request ID: ");

        console.log("\nPriority Options:");
        console.log("Low");
        console.log("Normal");
        console.log("High");
        console.log("Urgent");

        const priority = await askQuestion("New Priority: ");

        await manager.changePriority(
            requestId,
            priority,
            officerId
        );

        console.log("\nPriority changed successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function assignTechnician() {
    printHeader("ASSIGN TECHNICIAN");

    try {
        const officerId = await askQuestion("Service Officer ID: ");
        const requestId = await askQuestion("Request ID: ");
        const technicianId = await askQuestion("Technician ID: ");

        const technician = manager.findUserById(technicianId);

        if (!technician) {
            throw new Error("Technician not found.");
        }

        await manager.assignTechnician(
            requestId,
            technician,
            officerId
        );

        console.log("\nTechnician assigned successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function startWork() {
    printHeader("START WORK");

    try {
        const technicianId = await askQuestion("Technician ID: ");
        const requestId = await askQuestion("Request ID: ");

        await manager.startWork(
            requestId,
            technicianId
        );

        console.log("\nWork started successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function resolveRequest() {
    printHeader("RESOLVE REQUEST");

    try {
        const technicianId = await askQuestion("Technician ID: ");
        const requestId = await askQuestion("Request ID: ");
        const comment = await askQuestion("Resolution Comment: ");

        await manager.resolveRequest(
            requestId,
            technicianId,
            comment
        );

        console.log("\nRequest resolved successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function closeRequest() {
    printHeader("CLOSE REQUEST");

    try {
        const officerId = await askQuestion("Service Officer ID: ");
        const requestId = await askQuestion("Request ID: ");

        await manager.closeRequest(
            requestId,
            officerId
        );

        console.log("\nRequest closed successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewHistory() {
    printHeader("REQUEST HISTORY");

    try {
        const requestId = await askQuestion("Request ID: ");

        const history = manager.getRequestHistory(requestId);

        if (!history || history.length === 0) {
            console.log("\nNo history found.");
            return;
        }

        console.table(history);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewReports() {
    let running = true;

    while (running) {
        printHeader("REPORTS");

        console.log("1. Requests by Category");
        console.log("2. Requests by Priority");
        console.log("3. Urgent Requests");
        console.log("4. Requests by Technician");
        console.log("5. Completed Requests by Technician");
        console.log("6. Request Volume by Location");
        console.log("7. Average Resolution Time");
        console.log("8. Overdue Requests");
        console.log("9. Priority Score Report");
        console.log("10. Dashboard Report");
        console.log("11. Back");

        const choice = await askQuestion("Choose an option (1-11): ");

        try {
            switch (choice) {
                case "1":
                    console.table(
                        manager.getRequestSummaryByCategory()
                    );
                    break;

                case "2":
                    console.table(
                        manager.getRequestSummaryByPriority()
                    );
                    break;

                case "3":
                    printRequests(
                        manager.getUrgentRequests()
                    );
                    break;

                case "4":
                    console.table(
                        manager.getRequestsByTechnician()
                    );
                    break;

                case "5":
                    console.table(
                        manager.getCompletedRequestsByTechnician()
                    );
                    break;

                case "6":
                    console.table(
                        manager.getRequestVolumeByLocation()
                    );
                    break;

                case "7":
                    console.log(
                        `\nAverage Resolution Time: ` +
                        `${manager.getAverageResolutionTimeHours().toFixed(2)} hours`
                    );
                    break;

                case "8":
                    printRequests(
                        manager.getOverdueRequests()
                    );
                    break;

                case "9":
                    console.table(
                        manager.getPriorityScoreReport()
                    );
                    break;

                case "10":
                    console.log(
                        JSON.stringify(
                            manager.getDashboardReport(),
                            null,
                            2
                        )
                    );
                    break;

                case "11":
                    running = false;
                    break;

                default:
                    console.log("\nInvalid option.");
            }
        } catch (error) {
            console.log(`\nError: ${error.message}`);
        }
    }
}

async function mainMenu() {
    let running = true;

    while (running) {
        printHeader("CAMPUS SERVICE REQUEST MANAGEMENT SYSTEM");

        console.log("1.  Register User");
        console.log("2.  Submit Service Request");
        console.log("3.  View Request by ID");
        console.log("4.  View My Requests");
        console.log("5.  View All Requests");
        console.log("6.  Update My Request");
        console.log("7.  Cancel My Request");
        console.log("8.  Search Requests");
        console.log("9.  View Request Summary");
        console.log("10. Review Request");
        console.log("11. Change Request Priority");
        console.log("12. Assign Technician");
        console.log("13. Start Work");
        console.log("14. Resolve Request");
        console.log("15. Close Request");
        console.log("16. View Request History");
        console.log("17. View Reports");
        console.log("18. Exit");

        const choice = await askQuestion(
            "\nChoose an option (1-18): "
        );

        switch (choice) {
            case "1":
                await registerUser();
                break;

            case "2":
                await submitRequest();
                break;

            case "3":
                await viewRequest();
                break;

            case "4":
                await viewMyRequests();
                break;

            case "5":
                await viewAllRequests();
                break;

            case "6":
                await updateRequest();
                break;

            case "7":
                await cancelRequest();
                break;

            case "8":
                await searchRequests();
                break;

            case "9":
                await viewSummary();
                break;

            case "10":
                await reviewRequest();
                break;

            case "11":
                await changePriority();
                break;

            case "12":
                await assignTechnician();
                break;

            case "13":
                await startWork();
                break;

            case "14":
                await resolveRequest();
                break;

            case "15":
                await closeRequest();
                break;

            case "16":
                await viewHistory();
                break;

            case "17":
                await viewReports();
                break;

            case "18":
                running = false;
                break;

            default:
                console.log("\nInvalid option. Please choose 1-18.");
        }
    }

    console.log("\n========================================");
    console.log(" Thank you for using the Campus Service");
    console.log(" Request Management System.");
    console.log("========================================\n");

    rl.close();
}

async function startApplication() {
    try {
        printHeader("CAMPUS SERVICE REQUEST MANAGEMENT SYSTEM");

        console.log("\nLoading saved data...");

        await manager.loadData();

        console.log(`Users loaded: ${manager.getAllUsers().length}`);
        console.log(`Requests loaded: ${manager.getAllRequests().length}`);

        console.log("\nApplication ready.");

        await mainMenu();

    } catch (error) {
        console.error("\nApplication failed to start.");
        console.error(`Error: ${error.message}`);

        rl.close();
    }
}

startApplication();