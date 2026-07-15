import { useCallback, useEffect, useState } from "react";

import {
  deleteArShot,
  loadArShots,
  type ArShot,
} from "@/lib/arShotsStorage";

export function useArShots() {
  const [shots, setShots] = useState<ArShot[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setShots(await loadArShots());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const remove = useCallback(
    async (id: string) => {
      await deleteArShot(id);
      await refresh();
    },
    [refresh],
  );

  return { shots, loading, refresh, remove };
}
