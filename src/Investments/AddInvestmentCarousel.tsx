import { Plus } from "lucide-react";
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
  DialogTrigger,
} from "../ShadcnComponents/Dialog";
import { useState } from "react";
import "./Investments.css";
import InvestmentAddForm from "./InvestmentAddForm";
import AutomaticFileDrop from "./AutomaticFileDrop";
import { IParsedStatementData } from "../Models/Investments";

const AddInvestmentCarousel = () => {
  const [isManualChosen, setIsManualChosen] = useState(false);
  const [isAutomaticChosen, setIsAutomaticChosen] = useState(false);
  const [parsedStatementData, setParsedStatementData] = useState<
    IParsedStatementData | undefined
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
      <AutomaticFileDrop setParsedStatementData={setParsedStatementData} />
    );
    if (parsedStatementData) {
      addInvestmentSteps.push(
        <InvestmentAddForm parsedStatementData={parsedStatementData} />
      );
    }
  } else if (isManualChosen) {
    addInvestmentSteps.push(<InvestmentAddForm />);
  }

  return (
    <Dialog>
      <DialogTrigger className="dark" asChild>
        <Button className="Add-Investment-Button text-white">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="left-[57%] dark">
        <DialogHeader>
          <DialogTitle className="text-white text-4xl">
            Add Investment
          </DialogTitle>
          <DialogDescription className="text-white text-lg">
            Please follow along steps for adding an investment:
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex justify-center">
          <Carousel className="max-w-5xl">
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

export default AddInvestmentCarousel;
