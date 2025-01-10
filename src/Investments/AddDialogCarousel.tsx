import { Button } from "../ShadcnComponents/Button";
import { Card, CardContent } from "../ShadcnComponents/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ShadcnComponents/Carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ShadcnComponents/Dialog";
import { useState } from "react";
import "./Investments.css";
import InvestmentAddForm from "./InvestmentAddForm";
import AutomaticFileDrop from "./AutomaticFileDrop";
import {
  INewInvestment,
  INewStatement,
  IParsedInvestmentData,
} from "../Models/Investments";
import StatementAddForm from "./StatementAddForm";

interface AddDialogCarouselProps {
  isAddDialogCarouselOpen: boolean;
  handleAdd: (newData: INewInvestment | INewStatement) => void;
  setIsAddDialogCarouselOpen: (isOpen: boolean) => void;
  type: "Statement" | "Investment";
  header: string;
  subheader: string;
}

const AddDialogCarousel = ({
  isAddDialogCarouselOpen,
  handleAdd,
  setIsAddDialogCarouselOpen,
  type,
  header,
  subheader,
}: AddDialogCarouselProps) => {
  const [isManualChosen, setIsManualChosen] = useState(false);
  const [isAutomaticChosen, setIsAutomaticChosen] = useState(false);
  const [parsedInvestmentData, setParsedInvestmentData] = useState<
    IParsedInvestmentData | undefined
  >();

  const handleManualButtonClick = () => {
    setIsManualChosen(true);
    setIsAutomaticChosen(false);
  };

  const handleAutomaticButtonClick = () => {
    setIsAutomaticChosen(true);
    setIsManualChosen(false);
  };

  const addInvestmentSteps = [
    <div className="flex gap-4">
      <Button onClick={handleManualButtonClick} disabled={isManualChosen}>
        Manual
      </Button>
      <Button onClick={handleAutomaticButtonClick} disabled={isAutomaticChosen}>
        Automatic
      </Button>
    </div>,
  ];

  if (isAutomaticChosen) {
    addInvestmentSteps.push(
      <AutomaticFileDrop setParsedInvestmentData={setParsedInvestmentData} />
    );
  }

  if (type === "Investment") {
    if (parsedInvestmentData) {
      addInvestmentSteps.push(
        <InvestmentAddForm
          parsedData={parsedInvestmentData}
          handleAdd={handleAdd}
        />
      );
    } else if (isManualChosen) {
      addInvestmentSteps.push(<InvestmentAddForm handleAdd={handleAdd} />);
    }
  } else if (type === "Statement") {
    if (parsedInvestmentData) {
      addInvestmentSteps.push(
        <StatementAddForm
          parsedData={parsedInvestmentData}
          handleAdd={handleAdd}
        />
      );
    } else if (isManualChosen) {
      addInvestmentSteps.push(<StatementAddForm handleAdd={handleAdd} />);
    }
  }

  return (
    <Dialog
      open={isAddDialogCarouselOpen}
      onOpenChange={setIsAddDialogCarouselOpen}
    >
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="left-[57%] dark"
      >
        <DialogHeader>
          <DialogTitle className="text-white text-4xl">{header}</DialogTitle>
          <DialogDescription className="text-white text-lg">
            {subheader}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex justify-center px-10">
          <Carousel className="max-w-5xl" style={{ minWidth: "64em" }}>
            <CarouselContent style={{ height: "40rem" }}>
              {addInvestmentSteps.map((step, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 h-full">
                    <Card className="h-full">
                      <CardContent className="flex h-full w-full aspect-square items-center justify-center p-6">
                        {step}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialogCarousel;
