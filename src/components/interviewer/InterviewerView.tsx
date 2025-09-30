import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function InterviewerView() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
          <p className="text-muted-foreground">View and manage interview results</p>
        </div>
      </div>

      <Card className="p-12 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Candidates Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Candidate data will appear here once interviews are completed. Switch to the Interviewee tab to conduct an interview.
          </p>
        </div>
      </Card>
    </div>
  );
}
