"use client";

import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { useEventStream } from "@/src/hooks/useEventStream";

export default function EventStreamListener() {
  const { data: user } = useMyInfo();

  useEventStream(!!user);

  return null;
}
