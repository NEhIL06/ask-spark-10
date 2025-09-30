import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from './ChatMessage';
import { Timer } from './Timer';
import { Send, Loader2 } from 'lucide-react';
import { useInterviewStore } from '@/store/useInterviewStore';
import { Progress } from '@/components/ui/progress';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentQuestionIndex,
    questions,
    timeRemaining,
    isTimerActive,
    isInterviewActive,
    setTimeRemaining,
    submitAnswer,
    nextQuestion,
    setTimerActive,
  } = useInterviewStore();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentQuestion && isInterviewActive) {
      const message: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: currentQuestion.text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);
    }
  }, [currentQuestion, currentQuestionIndex, isInterviewActive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentQuestion) return;

    setIsLoading(true);
    setTimerActive(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    submitAnswer({
      questionId: currentQuestion.id,
      text: input,
      timeUsed: currentQuestion.timeLimit - timeRemaining,
      timestamp: new Date(),
    });

    setInput('');

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (currentQuestionIndex < totalQuestions - 1) {
      nextQuestion();
    } else {
      const completionMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Interview complete! Generating your results...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    }

    setIsLoading(false);
  };

  const handleTimeUp = () => {
    if (!currentQuestion || !isInterviewActive) return;

    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: "Time's up! Moving to the next question...",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, systemMessage]);

    submitAnswer({
      questionId: currentQuestion.id,
      text: input || '[No answer provided]',
      timeUsed: currentQuestion.timeLimit,
      timestamp: new Date(),
    });

    setInput('');
    
    if (currentQuestionIndex < totalQuestions - 1) {
      nextQuestion();
    }
  };

  if (!isInterviewActive) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Interview not started</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {currentQuestion?.difficulty}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </Card>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4 space-y-4">
          {currentQuestion && (
            <Timer
              timeRemaining={timeRemaining}
              totalTime={currentQuestion.timeLimit}
              isActive={isTimerActive}
              onTimeUp={handleTimeUp}
              onTick={setTimeRemaining}
            />
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="min-h-[60px] resize-none"
              disabled={isLoading || !isTimerActive}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim() || !isTimerActive}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
