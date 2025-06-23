import { query, param, body, oneOf } from "express-validator"

class BuildingValidator {
    getBuildingDetail = () => {
        return [
            param("buildingid").not().isEmpty().withMessage("building id is required"),
        ];
    };

    createBuilding = () => {
        return [
            body("name").not().isEmpty().withMessage("name is required"),
            body("description").not().isEmpty().withMessage("description is required"),
            body("supervision").not().isEmpty().withMessage("supervision is required"),
            body("addressDetail").not().isEmpty().withMessage("address detail is required"),
            body("addressDistrict").not().isEmpty().withMessage("address district is required"),
            body("addressCity").not().isEmpty().withMessage("address city is required"),
            body("addressCountry").not().isEmpty().withMessage("address country id is required"),
        ];
    }

    updateBuilding = () => {
        return [
            param("buildingid").not().isEmpty().withMessage("building id is required"),
            oneOf([
                body("name").not().isEmpty().withMessage("name is required"),
                body("description").not().isEmpty().withMessage("description is required"),
                body("supervision").not().isEmpty().withMessage("supervision is required"),
                body("addressDetail").not().isEmpty().withMessage("address detail is required"),
                body("addressDistrict").not().isEmpty().withMessage("address district is required"),
                body("addressCity").not().isEmpty().withMessage("address city is required"),
                body("addressCountry").not().isEmpty().withMessage("address country id is required"),
            ])
        ];
    }

    deleteBuilding = () => {
        return [
            param("buildingid").not().isEmpty().withMessage("building id is required"),
        ];
    }
}

export default new BuildingValidator();