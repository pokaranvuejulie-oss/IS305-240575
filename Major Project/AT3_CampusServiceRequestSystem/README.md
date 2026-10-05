# AT3 Major Project: Campus Service Request Management System

## Student Information

**Student Name:** Julie Pokaran Vue  
**Student ID:** 240575  
**Course:** IS305 – Object-Oriented Programming  
**Institution:** Divine Word University  
**Project:** AT3 Major Project – Campus Service Request Management System  
**Programming Language:** JavaScript  
**Platform:** Node.js Console Application  

---

# 1. Project Overview

The Campus Service Request Management System is a Node.js console-based application developed to manage service requests on a university campus.

The system provides a structured way for students and staff to submit requests for campus services and allows authorised service personnel to review, assign, process, resolve and close those requests.

The system supports four major service categories:

- ICT Support
- Facilities Maintenance
- Cleaning and Sanitation
- General Campus Service

The application demonstrates object-oriented programming principles including encapsulation, inheritance, polymorphism, abstraction, method overriding, validation, object relationships, persistence and file-based data management.

---

# 2. Project Objectives

The main objectives of the system are to:

1. Register and manage campus users.
2. Allow students and staff to submit service requests.
3. Validate user and request information.
4. Prevent duplicate user and request IDs.
5. Allow requesters to view and update their own requests.
6. Allow requesters to cancel eligible requests.
7. Allow service officers to review and assign requests.
8. Allow technicians to start and resolve assigned work.
9. Allow service officers to close completed requests.
10. Maintain request history and audit records.
11. Search, filter and sort service requests.
12. Generate service management reports.
13. Save and restore application data using JSON files.
14. Demonstrate advanced object-oriented programming concepts.

---

# 3. User Roles

The system supports four main user roles.

## 3.1 Student Requester

Students can:

- Register in the system.
- Submit service requests.
- View their requests.
- Update their own requests where permitted.
- Cancel eligible requests.
- Search and view request information.

## 3.2 Staff Requester

Staff users have similar requester functionality to students and can:

- Register in the system.
- Submit service requests.
- View their own requests.
- Update eligible requests.
- Cancel eligible requests.

## 3.3 Service Officer

Service Officers are responsible for managing service requests.

They can:

- Review requests.
- Assign technicians.
- Change request priorities.
- Close resolved requests.
- View request history.
- View service reports.

## 3.4 Technician

Technicians are responsible for completing assigned service work.

They can:

- View assigned requests.
- Start assigned work.
- Resolve assigned requests.
- Add resolution information.
- View relevant request information.

---

# 4. Request Workflow

The system uses the following request workflow:

```text
Submitted
    ↓
Reviewed
    ↓
Assigned
    ↓
In Progress
    ↓
Resolved
    ↓
Closed
```

A request can also be cancelled when cancellation is permitted:

```text
Submitted → Cancelled
```

The workflow ensures that requests progress through defined stages and that users can only perform actions appropriate to their roles.

---

# 5. Service Request Categories

The system supports four request categories.

### ICT Support

Used for computer, network, software and other technology-related problems.

Specialised information includes:

- Device type
- System name
- Fault type
- Network impact

### Facilities Maintenance

Used for physical facilities, buildings and equipment maintenance.

Specialised information includes:

- Building
- Room number
- Hazard level
- Equipment affected

### Cleaning and Sanitation

Used for cleaning and sanitation requirements.

Specialised information includes:

- Cleaning area
- Hygiene risk
- Service type
- Preferred service time

### General Campus Service

Used for general campus services that do not belong to the other specialised categories.

Specialised information includes:

- Service type
- Additional details

---

# 6. Priority Levels

Each service request has one of four priority levels:

- Low
- Normal
- High
- Urgent

The system also calculates priority scores and target resolution times for different request types.

Specialised request classes can modify the priority score based on factors such as:

- High network impact
- High hazard level
- High hygiene risk

---

# 7. Main System Classes

## User.js

The `User` class is the base class for system users.

It demonstrates:

- Private fields
- Encapsulation
- Getters
- Controlled setters
- Validation
- User information management

## StudentRequester.js

Extends the `User` class and represents student requesters.

Additional information includes:

- Programme
- Year level

## StaffRequester.js

Extends the `User` class and represents staff requesters.

Additional information includes:

- Department

## ServiceOfficer.js

Extends the `User` class and represents service officers.

Additional information includes:

- Service section

## Technician.js

Extends the `User` class and represents technicians.

Additional information includes:

- Technical speciality

## ServiceRequest.js

The `ServiceRequest` class is the base class for service requests.

It manages:

- Request ID
- Requester
- Title
- Description
- Campus location
- Category
- Priority
- Status
- Technician assignment
- Request dates
- Request history

The base class also contains abstract-style methods that throw errors when they are not implemented by specialised classes.

## ICTSupportRequest.js

Extends `ServiceRequest` and represents ICT-related requests.

## MaintenanceRequest.js

Extends `ServiceRequest` and represents facilities maintenance requests.

## CleaningRequest.js

Extends `ServiceRequest` and represents cleaning and sanitation requests.

## GeneralCampusServiceRequest.js

Extends `ServiceRequest` and represents general campus service requests.

## ServiceRequestManager.js

The `ServiceRequestManager` class controls the main business logic of the system.

It manages:

- User registration
- Request submission
- Request searching
- Request updates
- Request cancellation
- Request workflow
- Technician assignment
- Request history
- Audit records
- Reports
- Data persistence

## CampusServiceApp.js

Provides the console-based user interface.

The application provides menus for users, requesters, service officers and technicians.

---

# 8. Object-Oriented Programming Concepts

The project demonstrates the following object-oriented programming concepts.

## 8.1 Encapsulation

Private class fields are used to protect object data.

For example, classes use private fields such as:

```text
#userId
#firstName
#lastName
#email
```

Data is accessed through controlled getter and setter methods.

## 8.2 Inheritance

Specialised classes inherit common functionality from base classes.

For example:

```text
User
 ├── StudentRequester
 ├── StaffRequester
 ├── ServiceOfficer
 └── Technician
```

and:

```text
ServiceRequest
 ├── ICTSupportRequest
 ├── MaintenanceRequest
 ├── CleaningRequest
 └── GeneralCampusServiceRequest
```

The subclasses use `super()` to initialise inherited properties.

## 8.3 Polymorphism

The system uses polymorphism by allowing different request classes to provide their own implementations of methods such as:

- `calculatePriorityScore()`
- `getTargetResolutionHours()`
- `getRequestSummary()`
- `validate()`
- `toData()`

The system can work with different request types through their common base class while allowing specialised behaviour.

## 8.4 Abstraction

The base `ServiceRequest` class provides common request functionality while abstract-style methods are designed to be implemented by specialised request classes.

Calling unsupported base implementations produces an error.

## 8.5 Method Overriding

Subclasses override inherited methods to provide specialised behaviour.

For example, each specialised request class implements its own validation and priority calculation rules.

---

# 9. Validation

The system contains validation to protect the integrity of the data.

Validation includes:

- Missing user IDs
- Missing first names
- Missing last names
- Invalid email addresses
- Invalid user types
- Duplicate user IDs
- Duplicate request IDs
- Missing request titles
- Missing request descriptions
- Missing campus locations
- Invalid request categories
- Invalid priority levels
- Missing specialised request information
- Invalid specialised request information
- Unauthorised request updates
- Unauthorised request cancellation
- Attempting to cancel an already cancelled request
- Invalid workflow actions

Errors are displayed to the user when invalid information is entered.

---

# 10. Search and Filtering

The system supports searching and filtering service requests.

Requests can be searched using information such as:

- Request ID
- Requester ID
- Keyword
- Category
- Priority
- Status
- Campus location
- Technician

The system also supports sorting and filtering of request data.

---

# 11. Request History

The system maintains a history of important request status changes.

For example:

```text
Submitted → Reviewed
Reviewed → Assigned
Assigned → In Progress
In Progress → Resolved
Resolved → Closed
```

Each history entry records information such as:

- Previous status
- New status
- Action
- Actor ID
- Actor role
- Comment
- Date and time

This provides traceability of request activity.

---

# 12. Audit Trail

The system maintains an audit log for important system actions.

Examples include:

- User registration
- Request creation
- Request review
- Technician assignment
- Work commencement
- Request resolution
- Request closure
- Request cancellation
- Priority changes

The audit trail helps provide accountability and allows system activity to be reviewed.

---

# 13. JSON Data Persistence

The system uses Node.js `fs/promises` to save and load information from JSON files.

The main data files are:

```text
data/
├── users.json
├── serviceRequests.json
├── requestHistory.json
└── auditLog.json
```

This allows information to remain available after the application is closed and restarted.

---

# 14. Repository Pattern

The project uses repository classes to separate file storage operations from the main business logic.

Repository classes include:

```text
repositories/
├── UserFileRepository.js
├── ServiceRequestFileRepository.js
├── RequestHistoryFileRepository.js
└── AuditFileRepository.js
```

The repositories are responsible for loading and saving their respective data.

This improves the organisation and maintainability of the system.

---

# 15. Factory Pattern

Factory classes are used to recreate the correct object types from saved JSON data.

The project includes:

```text
UserFactory.js
ServiceRequestFactory.js
```

`UserFactory` can recreate:

- StudentRequester
- StaffRequester
- ServiceOfficer
- Technician

`ServiceRequestFactory` can recreate:

- ICTSupportRequest
- MaintenanceRequest
- CleaningRequest
- GeneralCampusServiceRequest

This ensures that objects restored from JSON retain their correct class behaviour.

---

# 16. Reports

The system provides several management reports.

The reports include:

1. Request summary by category
2. Request summary by priority
3. Urgent requests
4. Requests by technician
5. Completed requests by technician
6. Request volume by location
7. Average resolution time
8. Overdue requests
9. Priority score report
10. Dashboard report

The dashboard provides an overall summary including:

- Total requests
- Requests by status
- Total users
- Students
- Staff
- Service Officers
- Technicians
- Urgent requests
- Overdue requests
- Average resolution time

---

# 17. Project Folder Structure

```text
AT3_CampusServiceRequestSystem/
│
├── CampusServiceApp.js
├── CleaningRequest.js
├── GeneralCampusServiceRequest.js
├── ICTSupportRequest.js
├── MaintenanceRequest.js
├── README.md
├── ServiceOfficer.js
├── ServiceRequest.js
├── ServiceRequestFactory.js
├── ServiceRequestManager.js
├── StaffRequester.js
├── StudentRequester.js
├── Technician.js
├── User.js
├── UserFactory.js
│
├── data/
│   ├── users.json
│   ├── serviceRequests.json
│   ├── requestHistory.json
│   └── auditLog.json
│
├── repositories/
│   ├── UserFileRepository.js
│   ├── ServiceRequestFileRepository.js
│   ├── RequestHistoryFileRepository.js
│   └── AuditFileRepository.js
│
└── tests/
    └── CampusServiceSystem.test.js
```

---

# 18. How to Run the Application

## Step 1: Open the project folder

Open PowerShell in the project directory:

```text
AT3_CampusServiceRequestSystem
```

## Step 2: Run the application

Use:

```powershell
node CampusServiceApp.js
```

The console menu will then be displayed.

---

# 19. Automated Testing

The project includes automated tests using the Node.js built-in test runner.

The test file is:

```text
tests/CampusServiceSystem.test.js
```

Run the tests using:

```powershell
node --test tests\CampusServiceSystem.test.js
```

## Test Results

The completed system contains **20 automated tests**.

Final test result:

```text
Tests: 20
Passed: 20
Failed: 0
Skipped: 0
Cancelled: 0
```

### Test areas covered

The tests verify:

1. Student requester creation
2. Staff requester creation
3. Service officer creation
4. Technician creation
5. Invalid email validation
6. Missing user ID validation
7. General campus service request creation
8. Missing request title validation
9. Invalid priority validation
10. ICT support request validation
11. Maintenance request validation
12. Cleaning request validation
13. Polymorphic request methods
14. Request workflow
15. Request cancellation
16. Preventing repeated cancellation
17. Request history
18. UserFactory restoration
19. ServiceRequestFactory restoration
20. Abstract-style ServiceRequest methods

All 20 tests passed successfully.

---

# 20. Syntax Verification

The main JavaScript files were also checked using the Node.js syntax checker.

The following files passed syntax validation:

```text
User.js
ServiceRequest.js
ServiceRequestManager.js
CampusServiceApp.js
ICTSupportRequest.js
MaintenanceRequest.js
CleaningRequest.js
GeneralCampusServiceRequest.js
UserFactory.js
ServiceRequestFactory.js
```

No syntax errors were reported.

---

# 21. UML / Class Structure

The main class relationships can be represented as follows:

```text
                         User
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
 StudentRequester   StaffRequester   ServiceOfficer
                                           │
                                           ▼
                                      Technician


                    ServiceRequest
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
 ICTSupportRequest  MaintenanceRequest  CleaningRequest
                          │
                          │
                          ▼
               GeneralCampusServiceRequest
```

The actual project implements these relationships through JavaScript class inheritance.

---

# 22. User Guide

### Registering a User

1. Start the application.
2. Select the user registration option.
3. Enter the required user information.
4. The system validates the information.
5. A new user is saved if all information is valid.

### Creating a Request

1. Log in/select the requester option.
2. Select Submit Service Request.
3. Enter the request information.
4. Select a service category.
5. Select a priority.
6. Provide category-specific information where required.
7. Submit the request.
8. The request is saved with status `Submitted`.

### Updating a Request

1. Select the update option.
2. Enter the request ID.
3. The system verifies ownership.
4. Update the permitted information.
5. The system validates and saves the changes.

### Cancelling a Request

1. Select the cancellation option.
2. Enter the request ID.
3. The system verifies that the requester is authorised.
4. The request is changed to `Cancelled`.

A request that is already cancelled cannot be cancelled again.

### Processing a Request

Service Officers can review and assign requests.

Technicians can then:

```text
Start Work → Resolve Request
```

The Service Officer can then:

```text
Close Request
```

The system records these actions in the request history and audit log.

---

# 23. Error Handling

The system uses JavaScript error handling to prevent invalid operations.

Examples include:

```text
Invalid email address.
User ID is required.
Request title is required.
Invalid request priority.
Unauthorized request update.
Unauthorized request cancellation.
Request has already been cancelled.
```

This improves reliability and prevents invalid data from being stored.

---

# 24. Distinction-Level Features Implemented

The completed project includes advanced features beyond the basic requirements.

These include:

- Inheritance
- Polymorphism
- Abstract-style base methods
- Method overriding
- Specialised validation
- JSON persistence
- `fs/promises`
- Repository pattern
- Factory pattern
- Request history
- Audit trail
- Search and filtering
- Priority scoring
- Resolution targets
- Management reports
- Dashboard reporting
- Automated testing
- Data restoration after application restart

---

# 25. Conclusion

The Campus Service Request Management System provides a structured object-oriented solution for managing university campus service requests.

The system supports multiple user roles, specialised request types, controlled request workflows, validation, persistence, auditing, reporting and automated testing.

The final implementation demonstrates the practical application of object-oriented programming principles in JavaScript and provides a maintainable foundation that could be expanded into a larger campus service management system in the future.

---

# 26. AI Declaration

AI tools were used as a learning and development support resource during the project. Assistance was used for understanding programming concepts, debugging errors, improving code structure, developing test cases, explaining object-oriented programming concepts, and preparing project documentation.

The student reviewed, tested and integrated the resulting code and documentation into the final project.

All major project functionality was tested using the Node.js built-in test runner, with **20 out of 20 automated tests passing successfully**.