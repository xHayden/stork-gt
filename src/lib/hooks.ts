import { SessionContextValue } from "next-auth/react";
import { useState, useEffect } from "react";

interface NotificationHookData {
  data: any;
  loading: boolean;
  error: Error | undefined;
}

function useFetchNotifications(
  session: SessionContextValue
): NotificationHookData {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    async function fetchNotifications() {
      if (session.status != "authenticated") {
        return;
      }
      try {
        const response = await fetch(`/api/v1/notifications/user/${session.data.user._id}/`);
        if (!response.ok) {
            let res = await response.json();
            if (res?.error) {
                setData([]);
            } else {
                throw new Error(`HTTP error! ${JSON.stringify(res)}`);
            }
        } else {
            const data = await response.json();
            setData(data);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [session]);

  return { data, loading, error };
}

export default useFetchNotifications;
