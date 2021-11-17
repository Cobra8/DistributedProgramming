export const __backend__ = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "http://localhost:8081/";
export const __json__ = __backend__ + "json/";
