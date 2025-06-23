import { query, check, oneOf, param, body } from "express-validator"

class StationValidation {
    getStationDetail = () => {
        return [
            param("stationid").notEmpty().withMessage("station id is required")
        ];
    }

    create = () => {
        return [
            body('name').notEmpty().withMessage("name is required and not empty"),
            body('sensor').notEmpty().withMessage("sensor is required and not empty"),
            body('latitude').notEmpty().withMessage("latitude is required and not empty"),
            body('longitude').notEmpty().withMessage("longitude is required and not empty"),
            body('addressDetail').notEmpty().withMessage("address detail is required and not empty"),
            body('addressSubDistrict').notEmpty().withMessage("address sub district is required and not empty"),
            body('addressDistrict').notEmpty().withMessage("address district is required and not empty"),
            body('addressProvince').notEmpty().withMessage("address province is required and not empty"),
        ];
    }

    update = () => {
        return [
            param("stationid").not().isEmpty().withMessage("station id is required"),
            oneOf([
                body('name').notEmpty().withMessage("name is required and not empty"),
                body('description').not().isEmpty().withMessage("description is required"),
                body('sensor').notEmpty().withMessage("sensor is required"),
                body('latitude').notEmpty().withMessage("latitude is required"),
                body('longitude').notEmpty().withMessage("longitude is required"),
                body('addressDetail').notEmpty().withMessage("address detail is required"),
                body('addressSubDistrict').notEmpty().withMessage("address sub district is required"),
                body('addressDistrict').notEmpty().withMessage("address district is required"),
                body('addressProvince').notEmpty().withMessage("address province is required"),
            ])
        ];
    }

    delete = () => {
        return [
            param("stationid").not().isEmpty().withMessage("station id is required")
        ];
    }

}

export default new StationValidation();