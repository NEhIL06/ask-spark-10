import { useState } from 'react';
import { TabNavigation } from '@/components/TabNavigation';
import { IntervieweeView } from '@/components/interviewee/IntervieweeView';
import { InterviewerView } from '@/components/interviewer/InterviewerView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('interviewee');

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {activeTab === 'interviewee' ? <IntervieweeView /> : <InterviewerView />}
        </div>
      </div>
    </div>
  );
};

export default Index;
