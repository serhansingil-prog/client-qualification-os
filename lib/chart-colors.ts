export const CHART_SEQUENTIAL = { light: "#2a78d6", dark: "#3987e5" };

export const CHART_STATUS = {
  good: { light: "#0ca30c", dark: "#0ca30c" },
  goodStrong: { light: "#008300", dark: "#008300" },
  warning: { light: "#fab219", dark: "#fab219" },
  serious: { light: "#ec835a", dark: "#ec835a" },
  critical: { light: "#d03b3b", dark: "#d03b3b" },
};

export const CHART_INK = {
  secondary: { light: "#52514e", dark: "#c3c2b7" },
  muted: { light: "#898781", dark: "#898781" },
  grid: { light: "#e1e0d9", dark: "#2c2c2a" },
};

export const CHART_SURFACE = { light: "#fcfcfb", dark: "#1a1a19" };

export const DECISION_CHART_COLORS: Record<string, { light: string; dark: string }> = {
  hell_yes: CHART_STATUS.goodStrong,
  qualified_yes: CHART_STATUS.good,
  yellow_flag: CHART_STATUS.warning,
  soft_no: CHART_STATUS.serious,
  hard_no: CHART_STATUS.critical,
};
