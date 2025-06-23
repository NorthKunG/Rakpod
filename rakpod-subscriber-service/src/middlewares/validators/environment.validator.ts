import { query, check, oneOf, param, body } from "express-validator";

class EnvironmentValidation {
  getEnvironmentOfWeatherStation = () => {
    return [
      // query('type').isIn(['all', 'custom'])
      //     .withMessage("Invalid type, only isIn ['all','custom']"),
      // query('stationid')
      // .if(query('type').equals('all')).isEmpty()
      //     .withMessage("if type is all stationid should empty")
      //     .if(query('type').equals('custom')).notEmpty()
      //     .withMessage("station id is required"),
      query("stationid")
        .not()
        .isEmpty()
        .withMessage("station id required and not empty"),
      oneOf([
        query("date")
          .not()
          .isEmpty()
          .isISO8601()
          .withMessage("date is require format YYYY-MM-DD"),
        query("last")
          .not()
          .isEmpty()
          .isInt({ min: 0 })
          .withMessage(
            "last is require and type number more than 0 and not empty"
          ),
        // query('from').not().isEmpty().isISO8601().withMessage('from is require and not empty'),
        // query('to').not().isEmpty().isISO8601().withMessage('to is require and not empty'),
      ]),
      query("lastType")
        .if(query("last").notEmpty())
        .not()
        .isEmpty()
        .withMessage("if last not empty lasttype is require")
        .isIn(["days", "months"])
        .withMessage("Invalid type, only is days or months"),
      // query('from')
      //     .if(query('to').notEmpty()).not().isEmpty()
      //     .withMessage("if to not empty then from not empty"),
      // query('to')
      //     .if(query('from').notEmpty()).not().isEmpty()
      //     .withMessage("if from not empty then to not empty"),
    ];
  };
  getExportEnvironmentOfWeatherStation = () => {
    return [
      oneOf([
        query("date")
          .not()
          .isEmpty()
          .isISO8601()
          .withMessage("date is require format YYYY-MM-DD"),
        query("last")
          .not()
          .isEmpty()
          .isInt({ min: 1 })
          .withMessage(
            "last is require and type number more than 0 and not empty"
          ),
        query("from")
          .not()
          .isEmpty()
          .isISO8601()
          .withMessage("from is require and not empty"),
        query("to")
          .not()
          .isEmpty()
          .isISO8601()
          .withMessage("to is require and not empty"),
        query("month")
          .not()
          .isEmpty()
          .isISO8601()
          .withMessage("to is require and not empty"),
        query("year")
          .not()
          .isEmpty()
          .isISO8601()
          .withMessage("to is require and not empty"),
      ]),
      query("date")
        .if(query("from").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with from option")
        .if(query("last").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with last option")
        .if(query("to").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with to option"),
      query("last")
        .if(query("from").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with from option")
        .if(query("date").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with date option")
        .if(query("to").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with to option"),
      query("lastType")
        .if(query("last").notEmpty())
        .not()
        .isEmpty()
        .withMessage("if last not empty lasttype is require")
        .isIn(["days", "months"])
        .withMessage("Invalid type, only is days or months")
        .if(query("date").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with date option")
        .if(query("from").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with from option"),
      query("from")
        .if(query("last").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with last option")
        .if(query("date").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with date option")
        .if(query("to").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with to option"),
      query("month")
        .if(query("from").notEmpty())
        .isEmpty()
        .withMessage("if from not empty then to not empty")
        .if(query("date").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with date option")
        .if(query("last").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with last option"),
      query("to")
        .if(query("from").notEmpty())
        .not()
        .isEmpty()
        .withMessage("if from not empty then to not empty")
        .if(query("date").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with date option")
        .if(query("last").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with last option"),
      query("year")
        .if(query("from").notEmpty())
        .isEmpty()
        .withMessage("if from not empty then to not empty")
        .if(query("date").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with date option")
        .if(query("last").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with last option"),
      query("to")
        .if(query("from").notEmpty())
        .not()
        .isEmpty()
        .withMessage("if from not empty then to not empty")
        .if(query("date").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with date option")
        .if(query("last").notEmpty())
        .isEmpty()
        .withMessage("this option can not using with last option"),
    ];
  };
  getEnvironmentCompare = () => {
    return [
      // query('type').isIn(['all', 'custom'])
      //     .withMessage("Invalid type, only isIn ['all','custom']"),
      // query('stationid')
      // .if(query('type').equals('all')).isEmpty()
      //     .withMessage("if type is all stationid should empty")
      //     .if(query('type').equals('custom')).notEmpty()
      //     .withMessage("station id is required"),
      query("stationid")
        .not()
        .isEmpty()
        .withMessage("station id required and not empty"),
      oneOf([
        query("date")
          .not()
          .isEmpty()
          .isISO8601()
          .withMessage("date is require format YYYY-MM-DD"),
        query("last")
          .not()
          .isEmpty()
          .isInt({ min: 1 })
          .withMessage(
            "last is require and type number more than 0 and not empty"
          ),
        // query('from').not().isEmpty().isISO8601().withMessage('from is require and not empty'),
        // query('to').not().isEmpty().isISO8601().withMessage('to is require and not empty'),
      ]),
      query("lastType")
        .if(query("last").notEmpty())
        .not()
        .isEmpty()
        .withMessage("if last not empty lasttype is require")
        .isIn(["days", "months"])
        .withMessage("Invalid type, only is days or months"),
      // query('from')
      //     .if(query('to').notEmpty()).not().isEmpty()
      //     .withMessage("if to not empty then from not empty"),
      // query('to')
      //     .if(query('from').notEmpty()).not().isEmpty()
      //     .withMessage("if from not empty then to not empty"),
    ];
  };
}

export default new EnvironmentValidation();
