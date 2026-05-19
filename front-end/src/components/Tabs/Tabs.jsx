import {
  Tabs as StyledTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

function Tabs({ tabs }) {
  if (!Boolean(tabs)) {
    return null;
  }

  return (
    <StyledTabs defaultValue={tabs[0].id} className="w-full h-full">
      <TabsList variant="line" className="w-full justify-start">
        {tabs.map((tab) => {
          return (
            <TabsTrigger key={tab.id} value={tab.id} className="text-[16px]">
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.children}
        </TabsContent>
      ))}
    </StyledTabs>
  );
}

export default Tabs;
