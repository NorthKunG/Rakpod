export const multipleColumnSetAnd = (object: any) => {
  if (typeof object !== "object") {
    throw new Error("Invalid input");
  }

  const keys = Object.keys(object);
  const values = Object.values(object);

  let columnSet = keys.map((key) => `${key} = ?`).join(" AND ");

  return {
    columnSet,
    values,
  };
};
