import { useRef, useState } from "react";
import { Drawer } from "vaul";
import { Ripples, useRipples } from "../../components/ripples";
import { clearStorage } from "../../utils/storage";

export const ResetAllSettingsDrawer: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { createRipple, ripples } = useRipples(buttonRef);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = async () => {
    await clearStorage();
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <Drawer.Trigger className="w-max cursor-pointer">
        <p className="font-semibold text-red-400 hover:text-red-500 active:text-red-600 dark:text-neutral-300 dark:hover:text-neutral-200/80 dark:active:text-neutral-200/80 hover:underline text-sm mb-2 duration-200">
          Reset all settings
        </p>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Title>Reset all settings</Drawer.Title>
        <Drawer.Description>Reset all settings</Drawer.Description>
        <Drawer.Content className="flex flex-row flex-wrap items-center justify-center px-3 bg-white dark:bg-neutral-800 fixed bottom-0 left-0 right-0 outline-none">
          <button
            ref={buttonRef}
            type="button"
            className="group my-5 mx-auto w-full cursor-pointer rounded-lg border border-red-300 dark:border-red-500/80 dark:hover:border-red-400/70 dark:active:border-red-500/80 outline-0 hover:outline-2 dark:hover:outline-4 outline-red-200/50 dark:outline-red-400/10 active:outline-1 dark:active:outline-2 duration-100 ease-in-out"
            onClick={(e) => {
              createRipple(e);
              handleClick();
            }}
          >
            <div className="relative size-full py-2 overflow-hidden">
              <Ripples ripples={ripples} className="bg-red-500/10" />

              <p className="font-semibold group-active:scale-95 text-red-400 dark:text-red-500 text-sm duration-200">
                Reset all settings
              </p>
            </div>
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
