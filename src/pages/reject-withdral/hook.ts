import useState from '@/hooks/useState';
interface StateType {}
export default function useHookData() {
  const { state, setData } = useState<StateType>({});
  return { state, setData };
}
