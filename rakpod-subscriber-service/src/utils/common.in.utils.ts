export const multipleColumnSetIN = (object: any) => {
  if (typeof object !== "object") {
    throw new Error("Invalid input");
  }

  const keys = Object.keys(object);
  const values = Object.values(object).flat(); // Flatten the array of values

  let columnSet = keys
    .map((key) => `${key} IN (${values.map(() => "?").join(",")})`)
    .join(" AND ");

  return {
    columnSet,
    values,
  };
};
