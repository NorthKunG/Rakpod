export const removeUndefineKey = async (object: any) => {
  if (typeof object !== "object") {
    throw new Error("Invalid input");
  }

  Object.keys(object).forEach((key) => {
    if (object[key] === undefined) {
      delete object[key];
    }
  });

  return object;
};
