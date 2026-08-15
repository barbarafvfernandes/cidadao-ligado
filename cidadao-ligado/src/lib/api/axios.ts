import axios from "axios";

const portalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PORTAL_TRANSPARENCIA_URL || "https://api.portaldatransparencia.gov.br",
  timeout: 15000,
  headers: {
    "chave-api-dados": process.env.PORTAL_TRANSPARENCIA_KEY || "",
  },
});

export default portalApi;
