import { RotateCcw, ShieldMinus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "../../components/icon-button";
import { Input } from "../../components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/tooltip";
import { setTokenCapLimitAmountToStorage } from "../../utils/storage";
import { useAppSelector } from "../store";
import { ResetTokenUsageDrawer } from "./reset-token-usage-drawer";

export const TokenCapSettings: React.FC = () => {
  const tokenCapLimitAmount = useAppSelector(
    (state) => state.storageData.tokenCapLimitAmount,
  );

  const [localTokenCapLimitAmount, setLocalTokenCapLimitAmount] = useState<
    number | undefined
  >(tokenCapLimitAmount);

  // Store value to sync storage before unmount
  const tokenCapLimitAmountValueRef = useRef<number | undefined>(0); // Avoid stale value in the cleanup function of useEffect

  useEffect(() => {
    tokenCapLimitAmountValueRef.current = localTokenCapLimitAmount;
  }, [localTokenCapLimitAmount]);

  useEffect(() => {
    return () => {
      setTokenCapLimitAmountToStorage(tokenCapLimitAmountValueRef.current);
    };
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Tooltip>
        <TooltipTrigger className="flex flex-row flex-wrap items-center gap-2 w-max">
          <ShieldMinus
            size={24}
            className="stroke-neutral-500/80 dark:stroke-neutral-300/80 cursor-pointer"
          />
          <Input
            type="number"
            value={localTokenCapLimitAmount}
            className="w-[250px]"
            placeholder="Tokens cap limit warning"
            onChange={(e) => {
              if (e.currentTarget.value === "") {
                setLocalTokenCapLimitAmount(undefined);
              } else {
                setLocalTokenCapLimitAmount(
                  parseInt(e.currentTarget.value, 10),
                );
              }
            }}
            onBlur={() => {
              setTokenCapLimitAmountToStorage(localTokenCapLimitAmount);
            }}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">Token caps warning</TooltipContent>
      </Tooltip>

      <ResetTokenUsageDrawer>
        <IconButton tooltip="Reset token usage" contentClassName="p-2">
          <RotateCcw
            size={20}
            className="stroke-neutral-500 dark:stroke-neutral-300 group-hover:scale-105 group-active:scale-95 duration-200 ease-in-out"
          />
        </IconButton>
      </ResetTokenUsageDrawer>
    </div>
  );
};
