import useWebsocket, { ReadyState } from "@/hooks/ws";
import Endpoints from "@/types/api/endpoints";
import { Box, Center, HStack, Span, Spinner, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { FaDocker } from "react-icons/fa6";
import { LuContainer, LuCpu, LuMemoryStick, LuServer } from "react-icons/lu";
import { EmptyState } from "../ui/empty-state";
import { IconLabel } from "../ui/label";

type ServerInfoType = {
  name: string;
  version: string;
  containers: {
    total: number;
    running: number;
    paused: number;
    stopped: number;
  };
  images: number;
  n_cpu: number;
  memory: string;
};

export const ServerInfo: FC<{ server: ServerInfoType }> = ({ server }) => {
  return (
    <Box
      py="2"
      px="6"
      shadow={"xs"}
      borderRadius={"md"}
      bg="var(--on-bg-color)"
      alignContent={"center"}
      h="140px"
      minW="250px"
    >
      <Stack>
        <IconLabel fontSize={"xl"} icon={<LuServer />}>
          {server.name}
        </IconLabel>
        <HStack justifyContent={"space-between"}>
          <IconLabel icon={<LuCpu />}>
            {server.n_cpu} <Span fontWeight={"normal"}>CPUs</Span>
          </IconLabel>
          <IconLabel icon={<LuMemoryStick />}>{server.memory}</IconLabel>
        </HStack>
        <HStack justifyContent={"space-between"}>
          <IconLabel icon={<LuContainer />}>
            {server.containers.total}{" "}
            <Span fontWeight={"normal"}>Containers</Span>
          </IconLabel>
          <IconLabel icon={<FaDocker />}>{server.version}</IconLabel>
        </HStack>
      </Stack>
    </Box>
  );
};

export const ServerOverview: FC = () => {
  const { data: servers, readyState } = useWebsocket<ServerInfoType[]>(
    Endpoints.DOCKER_INFO,
    { json: true },
  );

  if (!servers) {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return (
          <Center>
            <Spinner />
          </Center>
        );
      case ReadyState.OPEN:
        return <EmptyState title="No servers found" />;
      default:
        return <EmptyState title="Failed to get server info" />;
    }
  }

  return (
    <Stack direction={"row"} h={"full"} wrap={"wrap"} overflow={"auto"} gap="4">
      {servers.map((server) => (
        <ServerInfo key={server.name} server={server} />
      ))}
    </Stack>
  );
};
