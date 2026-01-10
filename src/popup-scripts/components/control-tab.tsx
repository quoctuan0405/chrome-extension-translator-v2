import { Moon, Power, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { IconButton } from "../../components/icon-button";
import { cn } from "../../utils/cn";
import {
  toggleDarkmodeToStorage,
  toggleIsOnToStorage,
} from "../../utils/storage";
import { useAppSelector } from "../store";
import { ResetTokenUsageDrawer } from "./reset-token-usage-drawer";

export const ControlTab: React.FC = () => {
  const isOn = useAppSelector((state) => state.storageData.isOn);
  const isShowTokenUsage = useAppSelector(
    (state) => state.storageData.isShowTokenUsage,
  );
  const tokenCapLimitAmount = useAppSelector(
    (state) => state.storageData.tokenCapLimitAmount,
  );
  const tokenUsage = useAppSelector((state) => state.storageData.tokenUsage);

  return (
    <motion.div className="relative" initial={{ y: 2 }} animate={{ y: 0 }}>
      {/* Dark / light mode toggle icon button */}
      <div className="absolute top-2 right-4">
        <IconButton
          className="bg-neutral-300/40 hover:bg-neutral-300/60 dark:bg-neutral-700/50 dark:hover:bg-neutral-700"
          tooltip="Toggle dark mode"
          side="left"
          onClick={() => {
            toggleDarkmodeToStorage();
          }}
        >
          <Moon className="stroke-neutral-600 dark:stroke-neutral-400 group-hover:stroke-0 group-hover:fill-amber-500 group-hover:scale-125 group-active:scale-110 duration-200 ease-in-out" />
        </IconButton>
      </div>

      {/* On / off icon button */}
      <div className="flex flex-row flex-wrap items-center justify-center pt-5">
        <IconButton
          className="bg-neutral-300/40 hover:bg-neutral-300/60 dark:bg-neutral-700/50 dark:hover:bg-neutral-700"
          tooltip="Turn on/off"
          isBurstParticlesWhenClick={!isOn} // When button switch from off to on, burst particles!
          onClick={() => {
            toggleIsOnToStorage();
          }}
        >
          <Power
            className={cn(
              "size-20 text-green-500 group-hover:scale-105 group-active:scale-100 duration-200 ease-in-out -translate-y-0.5",
              {
                "grayscale brightness-75": !isOn,
              },
            )}
          />
        </IconButton>
      </div>
      <div className="mt-1 text-center text-lg text-neutral-700 dark:text-neutral-400 pb-3">
        {isOn ? "On" : "Off"}
      </div>

      {/* Token usage */}
      {isShowTokenUsage && !tokenCapLimitAmount && (
        <p className="text-neutral-600 dark:text-neutral-400 text-xs pb-2">
          {tokenUsage}{" "}
          <span className="text-neutral-500 dark:text-neutral-400">
            tokens used
          </span>
        </p>
      )}

      {tokenCapLimitAmount !== undefined && tokenCapLimitAmount !== 0 && (
        <div>
          <div
            role="progressbar"
            className="relative overflow-hidden w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"
          >
            <div
              style={{ width: `${(tokenUsage / tokenCapLimitAmount) * 100}%` }}
              className="absolute h-full bg-primary-500 dark:bg-primary-500/80"
            />
          </div>

          <div className="flex flex-row flex-wrap mt-2">
            <p className="text-neutral-600 dark:text-neutral-400 text-xs pb-2">
              {tokenUsage}{" "}
              <span className="text-neutral-500 dark:text-neutral-400">
                tokens used
              </span>
            </p>

            <div className="flex-1" />

            <ResetTokenUsageDrawer>
              <IconButton tooltip="Reset token usage" contentClassName="p-2">
                <RotateCcw
                  size={18}
                  className="stroke-neutral-500 dark:stroke-neutral-400 group-hover:scale-105 group-active:scale-95 duration-200 ease-in-out"
                />
              </IconButton>
            </ResetTokenUsageDrawer>
          </div>
        </div>
      )}
    </motion.div>
  );
};
