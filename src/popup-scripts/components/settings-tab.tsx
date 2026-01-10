import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IconButton } from "../../components/icon-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/tooltip";
import {
  setIsForgetfulModeToStorage,
  setIsShowContextToStorage,
  setIsShowTokenUsageToStorage,
  setSystemPromptToStorage,
} from "../../utils/storage";
import { useAppSelector } from "../store";
import { AdvancedSettingsCollapse } from "./advanced-settings-collapse";
import { MDEditor } from "./md-editor";
import { ResetAllSettingsDrawer } from "./reset-all-settings-drawer";
import { ResetTokenUsageDrawer } from "./reset-token-usage-drawer";
import { SwitchWithLabel } from "./switch-with-label";
import { TokenCapSettings } from "./token-cap-settings";

type Props = {
  onWidthResize?: (delta: number) => void;
};

export const SettingsTab: React.FC<Props> = ({ onWidthResize }) => {
  const isShowContext = useAppSelector(
    (state) => state.storageData.isShowContext,
  );
  const systemPrompt = useAppSelector(
    (state) => state.storageData.systemPrompt,
  );
  const isForgetfulMode = useAppSelector(
    (state) => state.storageData.isForgetfulMode,
  );
  const isShowTokenUsage = useAppSelector(
    (state) => state.storageData.isShowTokenUsage,
  );

  const [isShowAdvancedSettings, setIsShowAdvancedSettings] =
    useState<boolean>(false);

  return (
    <motion.div
      className="mt-2"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* System prompt */}
      <div className="mb-2">
        <p className="font-semibold text-neutral-500 dark:text-neutral-400 text-sm mb-2">
          System prompts
        </p>
        <MDEditor
          initialValue={systemPrompt}
          onWidthResize={onWidthResize}
          onChange={(markdown) => setSystemPromptToStorage(markdown)}
        />
      </div>

      {/* Show token usage */}
      <div className="flex flex-row flex-wrap items-center justify-between mb-2.5">
        <SwitchWithLabel
          className="py-2"
          label="Show token usage"
          checked={isShowTokenUsage}
          onCheckedChange={(isChecked) => {
            setIsShowTokenUsageToStorage(isChecked);
          }}
        />

        <AnimatePresence>
          {isShowTokenUsage && (
            <ResetTokenUsageDrawer>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <IconButton tooltip="Reset token usage" contentClassName="p-2">
                  <RotateCcw
                    size={20}
                    className="stroke-neutral-500 dark:stroke-neutral-300 group-hover:scale-105 group-active:scale-95 duration-200 ease-in-out"
                  />
                </IconButton>
              </motion.div>
            </ResetTokenUsageDrawer>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced settings */}
      <AdvancedSettingsCollapse
        isExpanded={isShowAdvancedSettings}
        onClick={() => {
          setIsShowAdvancedSettings((prev) => !prev);
        }}
      />

      <AnimatePresence>
        {isShowAdvancedSettings && (
          <motion.div
            className="flex flex-col flex-wrap gap-4 pt-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Show context */}
            <Tooltip>
              <TooltipTrigger className="w-max">
                <SwitchWithLabel
                  label="Show context"
                  checked={isShowContext}
                  onCheckedChange={(isChecked) =>
                    setIsShowContextToStorage(isChecked)
                  }
                />
              </TooltipTrigger>
              <TooltipContent side="right">
                Show what is sent to the LLM
              </TooltipContent>
            </Tooltip>

            {/* Forgetful mode */}
            <Tooltip>
              <TooltipTrigger className="w-max">
                <SwitchWithLabel
                  label="Forgetful mode"
                  checked={isForgetfulMode}
                  onCheckedChange={(isChecked) => {
                    setIsForgetfulModeToStorage(isChecked);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="right">
                Not remember conversation <br /> to save on tokens
              </TooltipContent>
            </Tooltip>

            {/* Tokens cap settings */}
            <TokenCapSettings />

            {/* Reset all settings */}
            <ResetAllSettingsDrawer />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
