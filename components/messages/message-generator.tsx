"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageTemplateSelector } from "@/components/messages/message-template-selector";
import { MessageEditor } from "@/components/messages/message-editor";
import { getMessageTemplate, renderMessageTemplate } from "@/lib/templates";
import { getRecommendedNextAction } from "@/lib/evaluation";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { addDays } from "@/lib/dates";
import type { ClientEvaluation } from "@/types/evaluation";
import type { AgencySettings } from "@/types/settings";
import type { ScoringResult } from "@/types/scoring";
import type { MessageCategory, MessageTone, MessageVariables } from "@/types/templates";

const DECISION_TO_CATEGORY: Record<ClientEvaluation["decision"], MessageCategory> = {
  hell_yes: "proposal_sending",
  qualified_yes: "pre_proposal_conditions",
  yellow_flag: "more_info_needed",
  soft_no: "soft_no",
  hard_no: "hard_no",
};

interface MessageGeneratorProps {
  evaluation: ClientEvaluation;
  settings: AgencySettings;
  result: ScoringResult;
}

export function MessageGenerator({ evaluation, settings, result }: MessageGeneratorProps) {
  const [category, setCategory] = useState<MessageCategory>(DECISION_TO_CATEGORY[result.decision]);
  const [tone, setTone] = useState<MessageTone>("professional");

  const variables: MessageVariables = useMemo(() => {
    const hasBlockingCriticalFailure = result.criticalFailures.some((f) => f.blocksApproval);
    return {
      clientName: evaluation.clientName,
      companyName: evaluation.companyName ?? "",
      contactName: evaluation.contactName ?? evaluation.clientName,
      projectName: evaluation.projectName,
      minBudget: formatCurrency(settings.minProjectBudget, evaluation.currency),
      currentBudget: formatCurrency(evaluation.estimatedBudget, evaluation.currency),
      requestedDeliveryDate: formatDate(evaluation.requestedDeliveryDate),
      proposedDeliveryDate: formatDate(addDays(evaluation.inquiryDate, 28)),
      agencyName: settings.agencyName,
      userName: settings.userName,
      serviceArea: evaluation.requestedService ?? settings.strategicFocusAreas.join(", "),
      recommendedNextStep:
        result.improvementConditions[0]?.description ??
        getRecommendedNextAction(result.decision, hasBlockingCriticalFailure),
    };
  }, [evaluation, settings, result]);

  const baseText = useMemo(() => {
    const template = getMessageTemplate(category, tone);
    return renderMessageTemplate(template, variables);
  }, [category, tone, variables]);

  const [renderedBaseText, setRenderedBaseText] = useState(baseText);
  const [text, setText] = useState(baseText);
  if (baseText !== renderedBaseText) {
    setRenderedBaseText(baseText);
    setText(baseText);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mesaj Oluşturucu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MessageTemplateSelector
          category={category}
          tone={tone}
          onCategoryChange={setCategory}
          onToneChange={setTone}
        />
        <MessageEditor value={text} onChange={setText} onReset={() => setText(baseText)} />
      </CardContent>
    </Card>
  );
}
