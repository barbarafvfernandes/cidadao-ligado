'use server';

import { Recurso } from "@/types/types";
import portalApi from "./axios";
import {MENSAGEM_SERVIDOR_INDISPONIVEL} from "@/utils/constants";

type QueryParams = {
    mesAnoInicio: string;
    mesAnoFim: string;
    pagina: number;
};

const isServidorIndisponivelError = (error: any) => {
    const status = error?.response?.status;
    const code = error?.code;
    const message = error?.message ?? "";

    return status === 504 || code === "ECONNABORTED" || code === "ETIMEDOUT" || /timeout/i.test(message);
};

export const getRecursosRecebidos = async (params: QueryParams): Promise<Recurso[]> => {
    try {
        const { mesAnoInicio, mesAnoFim, pagina } = params;

        const res = await portalApi.get<Recurso[]>("/api-de-dados/despesas/recursos-recebidos", {
            params: {
                mesAnoInicio,
                mesAnoFim,
                pagina,
            },
        });

        return res.data || [];
    } catch (error: any) {
        if (isServidorIndisponivelError(error)) {
            throw new Error(MENSAGEM_SERVIDOR_INDISPONIVEL);
        }

        console.error("Erro ao buscar recursos:", error);
        return [];
    }
};

