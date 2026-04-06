import { getApiErrorMessage } from "@/services/apiError";
import {
  getUsers,
  getUserSummary,
  UserItem,
  UserRole,
  UserStatus,
} from "@/services/user.api";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 50;

type RefetchOptions = {
  refreshing?: boolean;
  silent?: boolean;
};

export function useUsers() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({
    all: 0,
    admin: 0,
    manager: 0,
    seniormanager: 0,
    student: 0,
  });

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializedRef = useRef(false);

  const fetchData = useCallback(
    async (opts?: RefetchOptions) => {
      try {
        if (opts?.refreshing) {
          setRefreshing(true);
        } else if (!initializedRef.current) {
          setLoading(true);
        } else if (!opts?.silent) {
          setFiltering(true);
        }

        setError(null);

        const [usersRes, summaryRes] = await Promise.all([
          getUsers({
            Search: search.trim() || undefined,
            Page: 1,
            PageSize: PAGE_SIZE,
          }),
          getUserSummary(),
        ]);

        setItems(usersRes.items);

        const map: Record<string, number> = {
          all: usersRes.items.length,
          admin: 0,
          manager: 0,
          seniormanager: 0,
          student: 0,
        };

        summaryRes.forEach((item) => {
          map[item.roleName] = item.userCount;
        });

        setSummary(map);
        initializedRef.current = true;
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
        setFiltering(false);
      }
    },
    [search],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchData();
    }, 250);

    return () => clearTimeout(t);
  }, [fetchData]);

  const refetch = useCallback(
    (opts?: RefetchOptions) => {
      return fetchData(opts);
    },
    [fetchData],
  );

  return {
    items,
    summary,
    search,
    role,
    status,
    loading,
    refreshing,
    filtering,
    error,
    setSearch,
    setRole,
    setStatus,
    refetch,
  };
}
