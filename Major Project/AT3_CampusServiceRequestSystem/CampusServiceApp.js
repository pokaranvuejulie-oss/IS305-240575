const readline = require("readline");

const User = require("./User");
const ServiceRequest = require("./ServiceRequest");
const ServiceRequestManager = require("./ServiceRequestManager");

const manager = new ServiceRequestManager();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer.trim());
        });
    });
}

async function registerUser() {
    try {
        console.log("\n--- Register User ---");

        const userId = await askQuestion("User ID: ");
        const firstName = await askQuestion("First Name: ");
        const lastName = await askQuestion("Last Name: ");
        const email = await askQuestion("Email: ");
        const userType = await askQuestion("User Type (Student/Staff): ");

        const user = new User(
            userId,
            firstName,
            lastName,
            email,
            userType
        );

        manager.registerUser(user);

        console.log("\nUser registered successfully.");
        console.log(user.displayInfo());

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function submitRequest() {
    try {
        console.log("\n--- Submit Service Request ---");

        const requestId = await askQuestion("Request ID: ");
        const userId = await askQuestion("Requester User ID: ");

        const requester = manager.findUserById(userId);

        if (!requester) {
            throw new Error("Requester is not registered.");
        }

        const title = await askQuestion("Title: ");
        const description = await askQuestion("Description: ");
        const campusLocation = await askQuestion("Campus Location: ");

        console.log("\nCategories:");
        console.log("1. ICT Support");
        console.log("2. Facilities Maintenance");
        console.log("3. Cleaning and Sanitation");
        console.log("4. General Campus Service");

        const categoryChoice = await askQuestion("Choose category (1-4): ");

        const categories = {
            "1": "ICT Support",
            "2": "Facilities Maintenance",
            "3": "Cleaning and Sanitation",
            "4": "General Campus Service"
        };

        const category = categories[categoryChoice];

        if (!category) {
            throw new Error("Invalid category.");
        }

        console.log("\nPriorities:");
        console.log("1. Low");
        console.log("2. Normal");
        console.log("3. High");
        console.log("4. Urgent");

        const priorityChoice = await askQuestion("Choose priority (1-4): ");

        const priorities = {
            "1": "Low",
            "2": "Normal",
            "3": "High",
            "4": "Urgent"
        };

        const priority = priorities[priorityChoice];

        if (!priority) {
            throw new Error("Invalid priority.");
        }

        const request = new ServiceRequest(
            requestId,
            requester,
            title,
            description,
            campusLocation,
            category,
            priority
        );

        manager.submitRequest(request);

        console.log("\nService request submitted successfully.");
        console.log(`Request Status: ${request.getStatus()}`);

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewRequest() {
    try {
        console.log("\n--- View Request ---");

        const requestId = await askQuestion("Request ID: ");
        const request = manager.findRequestById(requestId);

        if (!request) {
            throw new Error("Request not found.");
        }

        console.log("\n" + request.getRequestSummary());

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewMyRequests() {
    try {
        console.log("\n--- View My Requests ---");

        const userId = await askQuestion("Your User ID: ");
        const requests = manager.getRequestsByUser(userId);

        if (requests.length === 0) {
            console.log("No requests found.");
            return;
        }

        requests.forEach(request => {
            console.log("\n--------------------");
            console.log(request.getRequestSummary());
        });

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewAllRequests() {
    console.log("\n--- All Service Requests ---");

    const requests = manager.getAllRequests();

    if (requests.length === 0) {
        console.log("No requests found.");
        return;
    }

    requests.forEach(request => {
        console.log("\n--------------------");
        console.log(request.getRequestSummary());
    });
}

async function updateRequest() {
    try {
        console.log("\n--- Update My Request ---");

        const requestId = await askQuestion("Request ID: ");
        const userId = await askQuestion("Your User ID: ");

        const title = await askQuestion("New title: ");
        const description = await askQuestion("New description: ");
        const campusLocation = await askQuestion("New campus location: ");

        const changes = {};

        if (title) {
            changes.title = title;
        }

        if (description) {
            changes.description = description;
        }

        if (campusLocation) {
            changes.campusLocation = campusLocation;
        }

        manager.updateRequest(requestId, userId, changes);

        console.log("\nRequest updated successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function cancelRequest() {
    try {
        console.log("\n--- Cancel My Request ---");

        const requestId = await askQuestion("Request ID: ");
        const userId = await askQuestion("Your User ID: ");

        manager.cancelRequest(requestId, userId);

        console.log("\nRequest cancelled successfully.");

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function searchRequests() {
    try {
        console.log("\n--- Search Requests ---");

        const searchText = await askQuestion("Enter request ID or title: ");

        const results = manager.searchRequests(searchText);

        if (results.length === 0) {
            console.log("No matching requests found.");
            return;
        }

        results.forEach(request => {
            console.log("\n--------------------");
            console.log(request.getRequestSummary());
        });

    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewRequestSummary() {
    console.log("\n--- Request Summary by Status ---");

    const summary = manager.getRequestSummaryByStatus();

    if (Object.keys(summary).length === 0) {
        console.log("No requests available.");
        return;
    }

    Object.entries(summary).forEach(([status, count]) => {
        console.log(`${status}: ${count}`);
    });
}

async function showMenu() {
    console.log(`
========================================
 CAMPUS SERVICE REQUEST MANAGEMENT SYSTEM
========================================

1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
`);

    const choice = await askQuestion("Choose an option (1-10): ");

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
            await viewRequestSummary();
            break;

        case "10":
            console.log("\nThank you for using the Campus Service Request Management System.");
            rl.close();
            return;

        default:
            console.log("\nInvalid option. Please choose 1-10.");
    }

    await showMenu();
}

console.log("\nWelcome to the Campus Service Request Management System!");

showMenu();