# AT3 Major Project: Campus Service Request Management System

## Student Information

**Student Name:** Julie Pokaran Vue  
**Student ID:** 240575  
**Course:** IS305 – Object-Oriented Programming  
**Institution:** Divine Word University  
**Project:** AT3 Major Project – Campus Service Request Management System

## Project Description

The Campus Service Request Management System is a Node.js console application developed to manage campus service requests.

The system allows students and staff to register as users and submit requests for services such as:

- ICT Support
- Facilities Maintenance
- Cleaning and Sanitation
- General Campus Service

The system records request information, validates user input, allows requesters to view and update their own requests, supports cancellation, searching, and provides a summary of requests by status.

## Pass Component

The Pass component implements the core object-oriented functionality of the system.

### Main Classes

- `User.js` – Represents registered students and staff.
- `ServiceRequest.js` – Represents a campus service request.
- `ServiceRequestManager.js` – Manages users and service requests.
- `CampusServiceApp.js` – Provides the console-based user interface.

## Features

The current system supports:

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

## Validation

The system validates:

- Missing user IDs
- Missing names
- Invalid email addresses
- Duplicate user IDs
- Duplicate request IDs
- Missing request titles
- Missing descriptions
- Unsupported categories
- Unsupported priorities
- Updates by another user
- Cancellation by another user
- Cancellation of already cancelled requests

## Service Request Categories

- ICT Support
- Facilities Maintenance
- Cleaning and Sanitation
- General Campus Service

## Priority Levels

- Low
- Normal
- High
- Urgent

## Request Status

New requests are automatically assigned the status:

`Submitted`

A submitted request can be cancelled, changing its status to:

`Cancelled`

## Object-Oriented Programming Concepts

The Pass component demonstrates:

- Classes and objects
- Constructors
- Private fields
- Encapsulation
- Getters and controlled setters
- Methods
- Object relationships
- Arrays
- Searching and filtering
- Validation
- Error handling

## Folder Structure

```text
AT3_CampusServiceRequestSystem/
│
├── User.js
├── ServiceRequest.js
├── ServiceRequestManager.js
├── CampusServiceApp.js
└── README.md