import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({
  affectedNodeId: null as string | null,
});

export const useAffectedNode = () => {
  const [affectedNodeId, setAffectedNodeId] = useGlobalState('affectedNodeId');
  return { affectedNodeId, setAffectedNodeId };
};