const ICTSupportRequest = require("./ICTSupportRequest");
const MaintenanceRequest = require("./MaintenanceRequest");
const CleaningRequest = require("./CleaningRequest");
const GeneralCampusServiceRequest = require("./GeneralCampusServiceRequest");

const UserFactory = require("./UserFactory");

class ServiceRequestFactory {

    static create(data) {
        return this.createFromData(data);
    }

    static createFromData(data) {
        if (!data || !data.category) {
            throw new Error("Invalid service request data.");
        }

        if (!data.requester) {
            throw new Error("Service request requester data is missing.");
        }

        const requester = UserFactory.createFromData
            ? UserFactory.createFromData(data.requester)
            : UserFactory.create(data.requester);

        let technician = null;

        if (data.technician) {
            technician = UserFactory.createFromData
                ? UserFactory.createFromData(data.technician)
                : UserFactory.create(data.technician);
        }

        let request;

        switch (data.category) {

            case "ICT Support":
                request = new ICTSupportRequest(
                    data.requestId,
                    requester,
                    data.title,
                    data.description,
                    data.campusLocation,
                    data.priority,
                    data.deviceType,
                    data.systemName,
                    data.faultType,
                    data.networkImpact
                );
                break;

            case "Facilities Maintenance":
                request = new MaintenanceRequest(
                    data.requestId,
                    requester,
                    data.title,
                    data.description,
                    data.campusLocation,
                    data.priority,
                    data.building,
                    data.roomNumber,
                    data.hazardLevel,
                    data.equipmentAffected
                );
                break;

            case "Cleaning and Sanitation":
                request = new CleaningRequest(
                    data.requestId,
                    requester,
                    data.title,
                    data.description,
                    data.campusLocation,
                    data.priority,
                    data.cleaningArea,
                    data.hygieneRisk,
                    data.serviceType,
                    data.preferredServiceTime
                );
                break;

            case "General Campus Service":
                request = new GeneralCampusServiceRequest(
                    data.requestId,
                    requester,
                    data.title,
                    data.description,
                    data.campusLocation,
                    data.priority,
                    data.serviceType,
                    data.additionalDetails
                );
                break;

            default:
                throw new Error(
                    `Unsupported service request category: ${data.category}`
                );
        }

        request.restoreState(data, technician);

        return request;
    }
}

module.exports = ServiceRequestFactory;