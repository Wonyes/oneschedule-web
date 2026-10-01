"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { notificationkeys } from "./querys/key/notificationKey";

export function useEventStream(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const source = new EventSource(
      `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api/sse/subscribe`,
      { withCredentials: true },
    );

    source.addEventListener("notification", () => {
      queryClient.invalidateQueries({ queryKey: [notificationkeys.list] });
      queryClient.invalidateQueries({
        queryKey: [notificationkeys.unreadCount],
      });
    });

    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) source.close();
    };

    return () => source.close();
  }, [enabled, queryClient]);
}
