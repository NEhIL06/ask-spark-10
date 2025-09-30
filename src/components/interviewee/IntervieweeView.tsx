import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ResumeUpload } from '@/components/chat/ResumeUpload';
import { InterviewChat } from '@/components/chat/InterviewChat';
import { useInterviewStore } from '@/store/useInterviewStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';

export function IntervieweeView() {
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const {
    candidateInfo,
    isInterviewActive,
    isInterviewComplete,
    setCandidateInfo,
    startInterview,
    resetInterview,
    continueInterview,
    finalScore,
    summary,
  } = useInterviewStore();

  useEffect(() => {
    if (candidateInfo && isInterviewActive && !isInterviewComplete) {
      setShowWelcomeBack(true);
    }
  }, []);

  const handleResumeUpload = (info: { name: string; email: string; phone: string }) => {
    setCandidateInfo(info);
  };

  const handleStartInterview = () => {
    // Mock questions for demonstration
    const mockQuestions = [
      { id: '1', text: 'Tell me about your experience with React hooks.', difficulty: 'easy' as const, timeLimit: 20 },
      { id: '2', text: 'Explain the difference between state and props in React.', difficulty: 'easy' as const, timeLimit: 20 },
      { id: '3', text: 'How would you optimize the performance of a React application?', difficulty: 'medium' as const, timeLimit: 60 },
      { id: '4', text: 'Describe how you would implement authentication in a Node.js application.', difficulty: 'medium' as const, timeLimit: 60 },
      { id: '5', text: 'Design a scalable API architecture for a high-traffic e-commerce platform.', difficulty: 'hard' as const, timeLimit: 120 },
      { id: '6', text: 'Explain how you would handle real-time data synchronization across multiple clients.', difficulty: 'hard' as const, timeLimit: 120 },
    ];

    startInterview(mockQuestions);
    setShowWelcomeBack(false);
  };

  const handleContinue = () => {
    continueInterview();
    setShowWelcomeBack(false);
  };

  const handleRestart = () => {
    resetInterview();
    setShowWelcomeBack(false);
  };

  if (isInterviewComplete && finalScore !== null) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center space-y-6 bg-gradient-hero">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Interview Complete!</h2>
            <p className="text-muted-foreground">
              Thank you for completing the interview, {candidateInfo?.name}
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {finalScore}
              </p>
            </div>

            {summary && (
              <div className="pt-4 border-t border-border text-left">
                <p className="text-sm text-muted-foreground mb-2">Summary</p>
                <p className="text-sm leading-relaxed">{summary}</p>
              </div>
            )}
          </div>

          <Button onClick={handleRestart} className="w-full">
            Start New Interview
          </Button>
        </Card>
      </div>
    );
  }

  if (!candidateInfo) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">AI Interview Assistant</h1>
          <p className="text-muted-foreground">
            Upload your resume to begin your technical interview
          </p>
        </div>
        <ResumeUpload onUploadComplete={handleResumeUpload} />
      </div>
    );
  }

  if (!isInterviewActive) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Ready to start?</h2>
            <p className="text-muted-foreground">
              Hi {candidateInfo.name}! Your interview will consist of 6 questions covering React and Node.js.
            </p>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span>2 Easy questions (20 seconds each)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span>2 Medium questions (60 seconds each)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span>2 Hard questions (120 seconds each)</span>
            </div>
          </div>

          <Button onClick={handleStartInterview} className="w-full" size="lg">
            Start Interview
          </Button>
        </Card>

        <Dialog open={showWelcomeBack} onOpenChange={setShowWelcomeBack}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome Back!</DialogTitle>
              <DialogDescription>
                You have an interview in progress. Would you like to continue or start over?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleRestart}>
                Start Over
              </Button>
              <Button onClick={handleContinue}>Continue Interview</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="h-full max-w-4xl mx-auto">
      <InterviewChat />
    </div>
  );
}
