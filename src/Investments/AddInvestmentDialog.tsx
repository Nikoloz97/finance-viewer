import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ShadcnComponents/Dialog";
import { Button } from "../ShadcnComponents/Button";
import { Plus } from "lucide-react";
import "./Investments.css";

const AddInvestmentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="dark" asChild>
        <Button className="Add-Investment-Button text-white">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark">
        <DialogHeader>
          <DialogTitle className="text-white">Add Investment</DialogTitle>
          <DialogDescription className="text-white">
            Please choose how you would like to put in your investment details
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-6 mb-2">
          <Button>Manual</Button>
          <Button>Automatic</Button>
        </div>
        <DialogFooter>
          <Button type="submit">Add Investment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentDialog;
