import type { DOMAttributes } from "react";
import { IconButton } from "../../components/icon-button";
import { cn } from "../../utils/cn";

type Props = {
  isSelected?: boolean;
  onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
};

export const XAiIconButton: React.FC<Props> = ({ isSelected, onClick }) => {
  return (
    <IconButton
      tooltip="XAi"
      isSelected={isSelected}
      isBackgroundLayoutTransition
      rippleScale={3}
      side="bottom"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 256 256"
        className="size-6 scale-[1.7] group-hover:scale-200 group-active:scale-[1.75] opacity-70 group-hover:opacity-100 duration-400 ease-out-overshoot-soft"
      >
        <title>XAi</title>
        <path
          className={cn("fill-[#0A0A0A] duration-200 ease-in-out", {
            "dark:fill-[#808080]": !isSelected,
            "dark:fill-[#f5f5f5]": isSelected,
          })}
          fill-rule="evenodd"
          d="M68 68H188V188H68V68ZM96.4131 162.803L145.065 93.3255H159.712L111.06 162.803H96.4131Z"
          clip-rule="evenodd"
        />
      </svg>
    </IconButton>
  );
};
