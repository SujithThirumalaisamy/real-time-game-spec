import { randomUUID } from "crypto";

// export const getUUID = () => randomUUID();

let i = 0;
export const getUUID = () => {
  i++;
  return "sargam" + i;
};
