export const areSimpleTypeObjectsEqual = (object1, object2) => {
  if (Object.keys(object1).length !== Object.keys(object2).length) {
    return false;
  }
  return Object.keys(object1).every((key) => object1[key] === object2[key]);
};
