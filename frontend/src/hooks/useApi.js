import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../services/api";

/**
 * Load data from an async function.
 *   const { data, loading, error, reload } = useApi(() => rooms.list(), []);
 * `deps` works like useEffect deps (e.g. [id]); call reload() to refetch.
 * On reload the previous data stays on screen, so tables don't flash.
 */
export default function useApi(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    fn()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((e) => active && setState({ data: null, loading: false, error: errorMessage(e) }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { ...state, reload };
}
