import { useEffect, useState } from "react";

// Runs a Supabase query and tracks its three states: loading, success, error.
//
//   const { data, loading, error, reload } = useFetch(
//     () => supabase.from("events").select("*"),
//     []            // re-run when these values change
//   );
//
// The fetcher must return { data, error } (Supabase does this already).
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let ignore = false; // ignore results if the component unmounted or deps changed
    setState((prev) => ({ ...prev, loading: true, error: null }));

    Promise.resolve(fetcher())
      .then(({ data, error }) => {
        if (ignore) return;
        if (error) {
          console.error("Supabase request failed:", error);
          setState({ data: null, error, loading: false });
        } else {
          setState({ data, error: null, loading: false });
        }
      })
      .catch((error) => {
        if (ignore) return;
        console.error("Request failed:", error);
        setState({ data: null, error, loading: false });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  return { ...state, reload: () => setReloadCount((n) => n + 1) };
}
