import { Button } from "@/components/ui/button";

interface ExampleQuestionProps {
  title: string;
  subtitle: string;
  onClick: (question: string) => void;
}

export function ExampleQuestion({ title, subtitle, onClick }: ExampleQuestionProps) {
  return (
    <Button
      variant="outline"
      className="h-auto flex-col items-start p-4 text-left hover:bg-muted/50"
      onClick={() => onClick(`${title} ${subtitle}`)}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </Button>
  );
}