import { NextRequest, NextResponse } from "next/server";
import { getRecursosRecebidos } from "@/lib/api/portal";
import {MENSAGEM_SERVIDOR_INDISPONIVEL} from "@/utils/constants";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mesAnoInicio, mesAnoFim, pagina } = body as {
      mesAnoInicio: string;
      mesAnoFim: string;
      pagina: number;
    };

    const dados = await getRecursosRecebidos({ mesAnoInicio, mesAnoFim, pagina });
    return NextResponse.json(dados);
  } catch (error) {
    const mensagem = error instanceof Error && error.message === MENSAGEM_SERVIDOR_INDISPONIVEL
      ? MENSAGEM_SERVIDOR_INDISPONIVEL
      : "Erro ao buscar recursos";

    console.error("Erro ao processar /api/recursos:", error);

    return NextResponse.json(
      { error: mensagem },
      { status: error instanceof Error && error.message === MENSAGEM_SERVIDOR_INDISPONIVEL ? 504 : 500 }
    );
  }
}
