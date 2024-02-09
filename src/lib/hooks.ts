import { SessionContextValue } from "next-auth/react";
import { DBNotification, Notification } from "@/app/types";
import useSWR, { mutate } from "swr";

export interface NotificationHookData {
  data?: DBNotification[];
  loading: boolean;
  error: Error | undefined;
  revalidate: () => Promise<(Notification & { _id: string })[]>
}

export function useFetchNotifications(
  session: SessionContextValue
): NotificationHookData {
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      let res = await response.json();
      if (res?.error) {
        return [];
      } else {
        throw new Error(`HTTP error! ${JSON.stringify(res)}`);
      }
    } else {
      return await response.json();
    }
  };

  const shouldFetch = session.status === "authenticated";
  const url = shouldFetch
    ? `/api/v1/notifications/user/${session.data.user._id}/`
    : null;

  const { data, error } = useSWR(url, fetcher);

  const loading = !data && !error;

  const revalidate = async (): Promise<(Notification & { _id: string })[]> => {
    if (url) {
      const newData = await mutate<(Notification & { _id: string })[]>(url);
      if (!newData) {
        throw new Error("Problem with revalidation? Mutate returned undefined.");
      }
      return newData;
    }
    return [];
  };

  return { data, loading, error, revalidate };
}

import { useEffect } from "react";

export function useOutsideClick(refs: React.RefObject<HTMLElement>[], callback: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const clickedOutsideAllRefs = refs.every(ref => {
                return ref.current && !ref.current.contains(event.target as Node);
            });
            
            if (clickedOutsideAllRefs) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refs, callback]);
}