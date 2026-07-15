"use client";

import { useCallback, useEffect, useState } from "react";
import {
  archiveEvaluation as archiveEvaluationInStorage,
  deleteEvaluation as deleteEvaluationInStorage,
  deleteEvaluations as deleteEvaluationsInStorage,
  duplicateEvaluation as duplicateEvaluationInStorage,
  getEvaluations,
} from "@/lib/storage";
import type { ClientEvaluation } from "@/types/evaluation";

export function useEvaluations() {
  const [evaluations, setEvaluations] = useState<ClientEvaluation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setEvaluations(getEvaluations());
  }, []);

  useEffect(() => {
    // localStorage is unavailable during SSR; load it after mount to avoid hydration mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoaded(true);
  }, [refresh]);

  const remove = useCallback(
    (id: string) => {
      deleteEvaluationInStorage(id);
      refresh();
    },
    [refresh]
  );

  const removeMany = useCallback(
    (ids: string[]) => {
      const count = deleteEvaluationsInStorage(ids);
      refresh();
      return count;
    },
    [refresh]
  );

  const archive = useCallback(
    (id: string, isArchived = true) => {
      archiveEvaluationInStorage(id, isArchived);
      refresh();
    },
    [refresh]
  );

  const duplicate = useCallback(
    (id: string) => {
      const copy = duplicateEvaluationInStorage(id);
      refresh();
      return copy;
    },
    [refresh]
  );

  return { evaluations, isLoaded, refresh, remove, removeMany, archive, duplicate };
}
