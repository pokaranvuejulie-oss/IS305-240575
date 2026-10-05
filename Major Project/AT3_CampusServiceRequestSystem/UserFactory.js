const StudentRequester = require("./StudentRequester");
const StaffRequester = require("./StaffRequester");
const ServiceOfficer = require("./ServiceOfficer");
const Technician = require("./Technician");

class UserFactory {
    static createFromData(data) {
        if (!data || !data.userType) {
            throw new Error("User data and user type are required.");
        }

        if (data.userType === "Student") {
            return new StudentRequester(
                data.userId,
                data.firstName,
                data.lastName,
                data.email,
                data.programme,
                data.yearLevel
            );
        }

        if (data.userType === "Staff") {
            return new StaffRequester(
                data.userId,
                data.firstName,
                data.lastName,
                data.email,
                data.department
            );
        }

        if (data.userType === "Service Officer") {
            return new ServiceOfficer(
                data.userId,
                data.firstName,
                data.lastName,
                data.email,
                data.serviceSection
            );
        }

        if (data.userType === "Technician") {
            return new Technician(
                data.userId,
                data.firstName,
                data.lastName,
                data.email,
                data.technicalSpeciality
            );
        }

        throw new Error(`Unsupported user type: ${data.userType}`);
    }
}

module.exports = UserFactory;