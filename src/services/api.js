import axios from "axios";
import { PERIOD_API_URL } from "./Apiconfig";

// формат "D-M-YYYY" без ведущих нулей
const toDMY = (d) => {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// const startOfDay = (d) => {
//   const x = new Date(d);
//   x.setHours(0, 0, 0, 0);
//   return x;
// };
// const endOfDay = (d) => {
//   const x = new Date(d);
//   x.setHours(23, 59, 59, 999);
//   return x;
// };

export const getTransactionByPeriod = async ({ token, start, end }) => {
  try {
    if (!token) throw new Error("Нет токена");

    const response = await axios.post(
      PERIOD_API_URL,
      { start: toDMY(start), end: toDMY(end) },
      {
        headers: { "Content-Type": "", Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response);
  }
};
