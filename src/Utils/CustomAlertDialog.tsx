import { CSSProperties } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ShadcnComponents/AltertDialog";
import { buttonVariants } from "../ShadcnComponents/Button";
import { cn } from "../utils";

interface CustomAlertDialogProps {
  onContinueClick: () => void;
  triggerText: string;
  title: string;
  description: string;
  isTriggerDisabled?: boolean;
  triggerStyle?: CSSProperties;
}

const CustomAlertDialog = ({
  onContinueClick,
  triggerText,
  title,
  description,
  triggerStyle,
  isTriggerDisabled = false,
}: CustomAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants())}
        disabled={isTriggerDisabled}
        style={triggerStyle}
      >
        {triggerText}
      </AlertDialogTrigger>
      <AlertDialogContent className="dark text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinueClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
