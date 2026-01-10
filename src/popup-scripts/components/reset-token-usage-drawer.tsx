import { useState } from "react";
import { Drawer } from "vaul";
import { Button } from "../../components/button";
import { clearTokenUsageToStorage } from "../../utils/storage";

type Props = {
  children?: React.ReactNode;
};

export const ResetTokenUsageDrawer: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    clearTokenUsageToStorage();
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Title>Reset all settings</Drawer.Title>
        <Drawer.Description>Reset all settings</Drawer.Description>
        <Drawer.Content className="flex flex-row flex-wrap items-center justify-center z-50 px-3 py-5 bg-white dark:bg-neutral-800 fixed bottom-0 left-0 right-0 outline-none">
          <Button onClick={handleClick}>
            <p className="py-2">Reset token usage</p>
          </Button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
