import { HealthMapContext } from "@/hooks/health_map";
import useWebsocket from "@/hooks/ws";
import Endpoints from "@/types/api/endpoints";
import { type HealthMap } from "@/types/api/health";
import { type ReactNode, useMemo } from "react";

export default function HealthProvider({ children }: { children: ReactNode }) {
  // useWSJSON should handle the single connection internally
  const { data: health } = useWebsocket<HealthMap>(Endpoints.HEALTH, {
    json: true,
  });

  const contextValue = useMemo(() => ({ health: health ?? {} }), [health]);

  return (
    <HealthMapContext.Provider value={contextValue}>
      {children}
    </HealthMapContext.Provider>
  );
}
