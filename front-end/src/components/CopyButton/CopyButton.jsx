import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function CopyButton({ content, text }) {
  const handleCopyClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Посилання скопійовано");
    } catch (err) {
      toast.error("Не вдалося скопіювати посилання");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size={`${text ? "default" : "icon"}`}
          onClick={handleCopyClick}
        >
          {text || <Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Скопіювати посилання на опитування</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default CopyButton;
