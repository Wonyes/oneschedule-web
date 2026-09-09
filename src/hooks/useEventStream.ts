"use client";

import { useEffect } from "react";

export function useEventStream(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const source = new EventSource(
      `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api/sse/subscribe`,
      { withCredentials: true },
    );

    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) source.close();
    };

    return () => source.close();
  }, [enabled]);
}
