import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, LayoutDashboard } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card border border-border">
        <TabsTrigger value="interviewee" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>Interviewee</span>
        </TabsTrigger>
        <TabsTrigger value="interviewer" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Interviewer</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
