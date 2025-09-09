// src/services/api.js
import axios from "axios";
import { PERIOD_API_URL } from "./apiConfig";

// YYYY-MM-DD
const toYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// всегда возвращаем МАССИВ транзакций
const unwrapList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.transactions)) return payload.transactions;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const getTransactionByPeriod = async ({ token, start, end }) => {
  if (!token) throw new Error("Нет токена");
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new Error("Невалидные даты периода");
  }

  const from = toYMD(start);
  const to = toYMD(end);

  // 1) Пытаемся сделать GET с query
  try {
    const url = `${PERIOD_API_URL}?from=${from}&to=${to}`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // если бэк уже умеет GET — просто вернём список
    const list = unwrapList(data);

    // если пришло «подсказочное» сообщение про неверный метод — уходим на POST
    const msg = (data && typeof data === "object" && data.message) || "";
    const methodHint = /метод.*неверно/i.test(String(msg));

    if (!methodHint) return list; // нормальный ответ (пусть даже пустой)

    // иначе проваливаемся в POST
  } catch (e) {
    // игнорим и попробуем POST
  }

  // 2) Фоллбэк: POST с телом { start, end } в формате YYYY-MM-DD
  // (на твоём бэке как раз такой контракт)
  const { data } = await axios.post(
    PERIOD_API_URL,
    { start: from, end: to },
    {
      headers: {
        // у тебя уже встречалась история с пустым Content-Type
        "Content-Type": "",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return unwrapList(data);
};
