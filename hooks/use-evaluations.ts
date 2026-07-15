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
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await getEvaluations();
      setEvaluations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Değerlendirmeler yüklenemedi.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const remove = useCallback(
    async (id: string) => {
      await deleteEvaluationInStorage(id);
      await refresh();
    },
    [refresh]
  );

  const removeMany = useCallback(
    async (ids: string[]) => {
      const count = await deleteEvaluationsInStorage(ids);
      await refresh();
      return count;
    },
    [refresh]
  );

  const archive = useCallback(
    async (id: string, isArchived = true) => {
      await archiveEvaluationInStorage(id, isArchived);
      await refresh();
    },
    [refresh]
  );

  const duplicate = useCallback(
    async (id: string) => {
      const copy = await duplicateEvaluationInStorage(id);
      await refresh();
      return copy;
    },
    [refresh]
  );

  return { evaluations, isLoaded, error, refresh, remove, removeMany, archive, duplicate };
}
