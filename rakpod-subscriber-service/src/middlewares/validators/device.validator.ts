import { query, check, oneOf, param, body } from "express-validator"

class DeviceValidator {
    getDeviceDetail = () => {
        return [
            param("deviceid").not().isEmpty().withMessage("device id is required"),
        ];
    };

    createDevice = () => {
        return [
            body("name").not().isEmpty().withMessage("name is required"),
            body("description").not().isEmpty().withMessage("description is required"),
            body("brand").not().isEmpty().withMessage("brand is required"),
            body("model").not().isEmpty().withMessage("model is required"),
            body("communication").not().isEmpty().withMessage("communication is required")
                .isIn(["mqtt"])
                .withMessage("Invalid type, only is mqtt"),
            body("appliancesType").not().isEmpty().withMessage("appliances type is required"),
            body("electricalSystem").not().isEmpty().withMessage("electrical system is required")
                .isIn(["onephase", "threephase"])
                .withMessage("Invalid type, only is onephase or threephase"),
            body("roomid").not().isEmpty().withMessage("room id is required")
        ];
    }

    updateDevice = () => {
        return [
            param("deviceid").not().isEmpty().withMessage("device id is required"),
            oneOf([
                check("name").not().isEmpty().withMessage("name is required"),
                check("description").not().isEmpty().withMessage("description is required"),
                check("brand").not().isEmpty().withMessage("brand is required"),
                check("model").not().isEmpty().withMessage("model is required"),
                check("communication").not().isEmpty().withMessage("communication is required")
                    .isIn(["mqtt"])
                    .withMessage("Invalid type, only is mqtt"),
                check("appliancesType").not().isEmpty().withMessage("appliances type is required"),
                check('status').not().isEmpty().withMessage("status is required")
                    .isIn(["online", "offline"])
                    .withMessage("Invalid type, only is online or offline"),
                check("electricalSystem").not().isEmpty().withMessage("electrical system is required")
                    .isIn(["onephase", "threephase"])
                    .withMessage("Invalid type, only is onephase or threephase")
            ])
        ]
    }

    deleteDevice = () => {
        return [
            param("deviceid").not().isEmpty().withMessage("device id is required")
        ]
    }
}


export default new DeviceValidator();