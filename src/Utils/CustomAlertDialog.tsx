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
  isTriggerDisabled?: boolean;
  triggerStyle?: CSSProperties;
  onContinueClick: () => void;
}

const CustomAlertDialog = ({
  isTriggerDisabled = false,
  triggerStyle,
  onContinueClick,
}: CustomAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants())}
        disabled={isTriggerDisabled}
        style={triggerStyle}
      >
        Delete Investment
      </AlertDialogTrigger>
      <AlertDialogContent className="dark text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Investment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
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
