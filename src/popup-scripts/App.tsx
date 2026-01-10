import { LayoutGroup } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { ConnectTab } from "./components/connect-tab";
import { ControlTab } from "./components/control-tab";
import "@mdxeditor/editor/style.css";
import { SettingsTab } from "./components/settings-tab";
import { useAppSelector } from "./store";

export const tabValueSchema = z.literal(["connect", "control", "settings"]);

export type TabValue = z.infer<typeof tabValueSchema>;

export const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabValue>("connect");

  // Switch to control tab when login
  const isConnectToAISuccessfully = useAppSelector(
    (store) =>
      store.storageData.apiKey &&
      store.storageData.aiVendor &&
      store.storageData.modelName,
  );

  useEffect(() => {
    if (isConnectToAISuccessfully) {
      setSelectedTab("control");
    }
  }, [isConnectToAISuccessfully]);

  // Resize
  const containerRef = useRef<HTMLDivElement>(null);
  const onWidthResize = (delta: number) => {
    const container = containerRef.current;
    if (container) {
      const { width } = container.getBoundingClientRect();

      container.style.width = `${width + delta}px`;
    }
  };

  return (
    <div ref={containerRef} className="dark:bg-neutral-800 p-4.5 min-w-[375px]">
      <LayoutGroup>
        <Tabs
          defaultValue="connect"
          value={selectedTab}
          onValueChange={(value) => {
            setSelectedTab(tabValueSchema.parse(value));
          }}
        >
          <TabsList className="w-full">
            <TabsTrigger value="connect" selectedValue={selectedTab}>
              Connect
            </TabsTrigger>
            <TabsTrigger value="control" selectedValue={selectedTab}>
              Control
            </TabsTrigger>
            <TabsTrigger value="settings" selectedValue={selectedTab}>
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect">
            <ConnectTab
              onConnectSuccessfully={() => {
                setSelectedTab("control");
              }}
            />
          </TabsContent>
          <TabsContent value="control">
            <ControlTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab onWidthResize={onWidthResize} />
          </TabsContent>
        </Tabs>
      </LayoutGroup>
    </div>
  );
};
