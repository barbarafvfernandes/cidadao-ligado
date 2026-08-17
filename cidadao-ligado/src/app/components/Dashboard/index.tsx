"use client";

import React, { useState } from "react";
import { Recurso } from "@/types/types";
import PieChart from "../PieChart";
import styles from './Dashboard.module.css';
import { MENSAGEM_SERVIDOR_INDISPONIVEL } from "@/utils/constants";

async function fetchRecursos(params: {
  mesAnoInicio: string;
  mesAnoFim: string;
  pagina: number;
}): Promise<{ dados: Recurso[]; error?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("/api/recursos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      const mensagem = payload?.error || "Erro ao buscar recursos";
      console.error("Erro na requisição de recursos:", res.status, mensagem);
      return { dados: [], error: mensagem };
    }

    return { dados: (payload || []) as Recurso[], error: undefined };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return { dados: [], error: "O Servidor do governo está fora do ar. Retorne sua pesquisa em alguns minutos!" };
    }

    console.error("Erro na requisição de recursos:", error);
    return { dados: [], error: "Erro ao buscar recursos" };
  } finally {
    clearTimeout(timeoutId);
  }
}

interface MainContentProps {
  data: {
    note?: string;
  };
}

export default function MainContent({ data }: MainContentProps) {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [pagina, setPagina] = useState<number>(1);
  const [dados, setDados] = useState<Recurso[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setCarregando(true);
    setErroMensagem("");

    const resultado = await fetchRecursos({
      mesAnoInicio: inicio,
      mesAnoFim: fim,
      pagina,
    });

    setDados(resultado.dados);
    setErroMensagem(resultado.error || "");
    setCarregando(false);
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  //topTipoPessoa: calcula os 4 tipos de pessoa com maior valor total
  const topTipoPessoa = React.useMemo(() => {
    const map = new Map<string, number>();
    dados.forEach((r) => {
      const key = r.tipoPessoa || "Desconhecido";
      map.set(key, (map.get(key) || 0) + (Number(r.valor) || 0));
    });
    const arr = Array.from(map.entries()).map(([tipoPessoa, total]) => ({ tipoPessoa, total }));
    arr.sort((a, b) => b.total - a.total);
    return arr.slice(0, 4);
  }, [dados]);

  const limparResultados = ()=>{
    setDados([]);
    setInicio('');
    setFim('');
    setPagina(1);
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.contentWrapper}>
            <div className={styles.textArea}>
              <span className={styles.topText}>
                Transparência pública em linguagem simples
              </span>
              <h1 className={styles.title}>
                Acompanhe despesas públicas e transferências com clareza.
              </h1>
              <p className={styles.description}>
                Uma visão organizada dos dados abertos do Portal da Transparência para facilitar o acompanhamento da sociedade civil, pesquisadores e jornalistas.
              </p>
            </div>
            <div className={styles.sourceBox}>
              <p className={styles.sourceTitle}>Fonte</p>
              <p className={styles.sourceValue}>
                Dados Oficiais do Governo Federal
              </p>
              {data.note ? <p className={styles.sourceNote}>{data.note}</p> : null}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.formHeader}>
            <h2 className={styles.sectionTitle}>Buscar e filtrar</h2>
            <p className={styles.sectionDescription}>
              Localize órgãos, favorecidos ou municípios em poucos segundos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <label className={styles.labelGroup}>
              <span className={styles.labelText}>Início (MM/AAAA)</span>
              <input
                type="text"
                placeholder="MM/AAAA"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className={styles.input}
              />
            </label>

            <label className={styles.labelGroup}>
              <span className={styles.labelText}>Fim (MM/AAAA)</span>
              <input
                type="text"
                placeholder="MM/AAAA"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
                className={styles.input}
              />
            </label>

            <label className={styles.labelGroup}>
              <span className={styles.labelText}>Página</span>
              <input
                type="number"
                value={pagina}
                onChange={(e) => setPagina(Number(e.target.value))}
                className={`${styles.input} ${styles.inputPage}`}
              />
            </label>

            <button type="submit" className={styles.button} disabled={carregando}>
              {carregando ? "Buscando..." : "Buscar"}
            </button>
          </form>

          <div className={styles.resultsContainer}>
            {erroMensagem && (
              <div className={styles.errorBanner} role="alert">
                {erroMensagem === MENSAGEM_SERVIDOR_INDISPONIVEL ? MENSAGEM_SERVIDOR_INDISPONIVEL : erroMensagem}
              </div>
            )}

            <section className={styles.resultsGrid}>
              <div className={styles.leftPanel}>
                <div className={styles.panelHeader}>
                  <h3>Despesas encontradas:</h3>
                  <div className={styles.countBadge}>{dados.length} registros</div>
                </div>
                <div className={styles.resultsList}>
                  {dados.length > 0 ? (
                  <ul className={styles.list}>
                    {dados.map((recurso, index) => (
                      <li key={`${recurso.codigoPessoa}-${recurso.anoMes}-${index}`} className={styles.listItem}>
                        <div className={styles.rowTop}>
                          <div className={styles.itemTitle}>{recurso.nomePessoa}</div>
                          <div className={styles.itemValue}>{formatCurrency(Number(recurso.valor))}</div>
                        </div>
                        <div className={styles.rowMeta}>{recurso.tipoPessoa} · {recurso.municipioPessoa}</div>
                        <div className={styles.rowMetaSmall}>{recurso.nomeOrgao}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !carregando && !erroMensagem && <p className={styles.emptyText}>Nenhum dado consultado ainda.</p>
                )}
                </div>

                <div>
                  {dados.length > 0 && (
                    <button type="button" className={styles.button} onClick={limparResultados}>
                      Limpar Busca
                    </button>
                  )}
                </div>

              </div>

              <aside className={styles.rightPanel}>
                <div className={styles.sideBox}>
                  <h3>Despesas por tipo de beneficiário:</h3>
                  <div className={styles.statsList}>
                    {topTipoPessoa.length === 0 ? (
                      <p className={styles.emptyText}>Sem dados para mostrar.</p>
                    ) : (
                      topTipoPessoa.map((item) => (
                        <div key={item.tipoPessoa} className={styles.statsItem}>
                          <div className={styles.statsLabel}>{item.tipoPessoa}</div>
                          <div className={styles.statsValue}>{formatCurrency(item.total)}</div>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${Math.min((item.total / (topTipoPessoa[0]?.total || 1)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}

                    <div className={styles.totalFound}>
                      Total encontrado: {formatCurrency(topTipoPessoa.reduce((sum, item) => sum + item.total, 0))}
                    </div>

                    {topTipoPessoa.length > 0 && (
                      <div className={styles.pieChartMargin}>
                        <h3>Distribuição por beneficiário:</h3>
                        <PieChart data={topTipoPessoa} formatCurrency={formatCurrency} />
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
