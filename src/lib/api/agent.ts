import Endpoints, { buildQuery } from "@/types/api/endpoints";

import { fetchEndpoint } from "@/types/api/endpoints";

export type PEMPair = {
  Key: Uint8Array;
  Cert: Uint8Array;
};

export function addAgent({
  host,
  port,
  ca,
  client,
}: {
  host: string;
  port: number;
  ca: PEMPair;
  client: PEMPair;
}) {
  return fetchEndpoint(Endpoints.ADD_AGENT, {
    method: "POST",
    body: JSON.stringify({ host: `${host}:${port}`, ca, client }),
  });
}

export type NewAgentResponse = {
  compose: string;
  ca: PEMPair;
  client: PEMPair;
};

export type AgentType = "docker" | "system";
export type AddAgentForm = {
  type: AgentType;
  name: string;
  host: string;
  port: number;
  nightly: boolean;
};

export function newAgent(form: AddAgentForm): Promise<NewAgentResponse> {
  return fetchEndpoint(Endpoints.NEW_AGENT + buildQuery(form)).then((res) =>
    res?.json(),
  );
}
