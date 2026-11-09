import { getCriterionByIdForSector } from "@/lib/criteria";
import type { ClientEvaluation, DecisionLevel } from "@/types/evaluation";
import type { Sector } from "@/types/settings";

export type EvaluationGraphNodeKind = "evaluation" | "industry" | "leadSource" | "risk";

export interface EvaluationGraphNode {
  id: string;
  title: string;
  kind: EvaluationGraphNodeKind;
  decision: DecisionLevel | null;
}

export interface EvaluationGraphLink {
  source: string;
  target: string;
}

export interface EvaluationGraphData {
  nodes: EvaluationGraphNode[];
  links: EvaluationGraphLink[];
}

/** Groups evaluations by a shared attribute (industry, lead source, a
 * critical-risk criterion) and, for every group with 2+ members, adds one
 * hub node plus a spoke from each member to that hub. A hub — not pairwise
 * edges between every member — keeps the link count linear in group size
 * instead of quadratic, and gives the shared attribute itself a visible,
 * labeled place in the graph. */
function addHubGroup(
  evaluations: ClientEvaluation[],
  keyOf: (e: ClientEvaluation) => string[],
  kind: EvaluationGraphNodeKind,
  nodes: EvaluationGraphNode[],
  links: EvaluationGraphLink[],
  labelOf: (key: string) => string = (key) => key
) {
  const groups = new Map<string, ClientEvaluation[]>();
  for (const evaluation of evaluations) {
    for (const key of keyOf(evaluation)) {
      if (!key) continue;
      const members = groups.get(key) ?? [];
      members.push(evaluation);
      groups.set(key, members);
    }
  }

  for (const [key, members] of groups) {
    if (members.length < 2) continue;
    const hubId = `${kind}:${key}`;
    nodes.push({ id: hubId, title: labelOf(key), kind, decision: null });
    for (const member of members) {
      links.push({ source: member.id, target: hubId });
    }
  }
}

export function buildEvaluationGraph(
  evaluations: ClientEvaluation[],
  sector: Sector = "automation"
): EvaluationGraphData {
  const nodes: EvaluationGraphNode[] = evaluations.map((evaluation) => ({
    id: evaluation.id,
    title: evaluation.clientName || evaluation.companyName || "İsimsiz",
    kind: "evaluation",
    decision: evaluation.decision,
  }));
  const links: EvaluationGraphLink[] = [];

  addHubGroup(evaluations, (e) => (e.industry ? [e.industry] : []), "industry", nodes, links);
  addHubGroup(evaluations, (e) => (e.leadSource ? [e.leadSource] : []), "leadSource", nodes, links);
  addHubGroup(
    evaluations,
    (e) => e.criticalFailures.map((f) => f.criterionId).filter((id): id is string => Boolean(id)),
    "risk",
    nodes,
    links,
    (criterionId) => riskHubLabel(criterionId, sector)
  );

  return { nodes, links };
}

function riskHubLabel(criterionId: string, sector: Sector): string {
  return getCriterionByIdForSector(criterionId, sector)?.name ?? criterionId;
}
