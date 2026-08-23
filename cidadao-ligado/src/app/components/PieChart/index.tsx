import styles from "./PieChart.module.css";

type PieChartItem = {
  tipoPessoa: string;
  total: number;
};

interface PieChartProps {
  data: PieChartItem[];
  formatCurrency: (value: number) => string;
}

export default function PieChart({ data, formatCurrency }: PieChartProps) {
  if (!data.length) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.total, 0) || 1;
  const colors = ["#38bdf8", "#22c55e", "#f97316", "#a855f7"];
  let startAngle = 0;

  const chartSummary = data
    .map((item) => `${item.tipoPessoa}: ${formatCurrency(item.total)}`)
    .join("; ");

  return (
    <div className={styles.pieChartContainer}>
      <svg
        viewBox="0 0 200 200"
        className={styles.pieChart}
        role="img"
        aria-labelledby="pie-chart-title pie-chart-desc"
      >
        <title id="pie-chart-title">Distribuição por tipo de beneficiário</title>
        <desc id="pie-chart-desc">{chartSummary}</desc>

        {data.map((item, index) => {
          const sliceAngle = (item.total / total) * 360;
          const endAngle = startAngle + sliceAngle;
          const largeArc = sliceAngle > 180 ? 1 : 0;
          const radius = 90;
          const cx = 100;
          const cy = 100;
          const startX = cx + radius * Math.cos((Math.PI / 180) * startAngle);
          const startY = cy + radius * Math.sin((Math.PI / 180) * startAngle);
          const endX = cx + radius * Math.cos((Math.PI / 180) * endAngle);
          const endY = cy + radius * Math.sin((Math.PI / 180) * endAngle);
          const d = `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;

          startAngle = endAngle;

          return (
            <path
              key={item.tipoPessoa}
              d={d}
              fill={colors[index % colors.length]}
            />
          );
        })}
      </svg>

      <p className="srOnly">Resumo gráfico: {chartSummary}</p>

      <div className={styles.pieLegend}>
        {data.map((item, index) => (
          <div key={item.tipoPessoa} className={styles.legendItem}>
            <div className={styles.legendLeft}>
              <span
                className={styles.legendBullet}
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className={styles.legendLabel}>{item.tipoPessoa}</span>
            </div>
            <div className={styles.legendValue}>{formatCurrency(item.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
