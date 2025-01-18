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
      className="h-auto flex-col items-start p-4 text-left bg-[#18181B] border-0 hover:bg-[#27272A] transition-colors"
      onClick={() => onClick(`${title} ${subtitle}`)}
    >
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="text-xs text-[#71717A]">{subtitle}</div>
    </Button>
  );
}