import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/tooltip";
import { useAppSelector } from "../store";

// https://nikitahl.com/circle-progress-bar-css
export const TokenUsageProgress: React.FC = () => {
  const tokenCapLimitAmount = useAppSelector(
    (state) => state.storageData.tokenCapLimitAmount,
  );
  const tokenUsage = useAppSelector((state) => state.storageData.tokenUsage);

  if (!tokenCapLimitAmount) {
    return;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="ml-3 size-5 rounded-full cursor-pointer"
          style={{
            background: `radial-gradient(closest-side, white 60%, transparent 0% 100%),
          conic-gradient(var(--color-primary-500) ${(tokenUsage / tokenCapLimitAmount) * 100}%, var(--color-primary-100) 0)`,
          }}
        />
      </TooltipTrigger>

      <TooltipContent>
        <p>{tokenUsage} tokens used</p>
      </TooltipContent>
    </Tooltip>
  );
};
