import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ResumeUploadProps {
  onUploadComplete: (candidateInfo: { name: string; email: string; phone: string }) => void;
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF or DOCX file',
        variant: 'destructive',
      });
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    try {
      // TODO: Implement actual resume parsing with Lovable Cloud
      // For now, simulate parsing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock parsed data
      const mockData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      toast({
        title: 'Resume uploaded successfully',
        description: 'Your information has been extracted',
      });

      onUploadComplete(mockData);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 border-dashed border-2 border-border hover:border-primary transition-colors">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : fileName ? (
            <FileText className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Upload Your Resume</h3>
          <p className="text-sm text-muted-foreground">
            {fileName || 'PDF or DOCX format, max 5MB'}
          </p>
        </div>

        <label htmlFor="resume-upload">
          <Button
            type="button"
            disabled={isUploading}
            className={cn(
              'cursor-pointer',
              isUploading && 'pointer-events-none'
            )}
            onClick={() => document.getElementById('resume-upload')?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : fileName ? (
              'Upload Another'
            ) : (
              'Choose File'
            )}
          </Button>
        </label>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </Card>
  );
}
