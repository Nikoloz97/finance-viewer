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

const AddInvestmentCarousel = () => {
  const [isManualChosen, setIsManualChosen] = useState(false);
  const [isAutomaticChosen, setIsAutomaticChosen] = useState(false);
  const [isManualFormCompleted, setIsManualFormCompleted] = useState(false);
  const [isAutomaticFileDropped, setIsAutomaticFileDropped] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleManualButtonClick = () => {
    setIsManualChosen(true);
    setIsAutomaticChosen(false);
  };

  const handleAutomaticButtonClick = () => {
    setIsAutomaticChosen(true);
    setIsManualChosen(false);
  };

  // TODO: see CarouselNext component
  const handleStepIncrement = () => {
    const tempCurrentStep = currentStep;
    setCurrentStep(tempCurrentStep + 1);
  };

  // TODO: see CarouselPrev component
  const handleStepDecrement = () => {
    const tempCurrentStep = currentStep;
    setCurrentStep(tempCurrentStep - 1);
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
    <div>
      {isAutomaticChosen ? (
        <div>Automatic file drop</div>
      ) : (
        <div>Manual form</div>
      )}
    </div>,
  ];

  if (isAutomaticChosen) {
    addInvestmentSteps.push(<div>Automatic form</div>);
  }

  // TODO: see carousel next component
  const isNextButtonEnabled =
    (currentStep === 1 && (isManualChosen || isAutomaticChosen)) ||
    (currentStep === 2 && isManualFormCompleted) ||
    isAutomaticFileDropped ||
    currentStep !== addInvestmentSteps.length;

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
            Please following along steps for adding and investment
          </DialogDescription>
        </DialogHeader>

        {/* Carousel here */}
        <div className="w-full flex justify-center">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {addInvestmentSteps.map((step, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        {step}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
            // TODO: find way to append this to functionality
            // onClick={handleStepDecrement}
            />
            <CarouselNext
            // TODO: find way to append this to functionality
            // disabled={!isNextButtonEnabled}
            // onClick={handleStepIncrement}
            />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentCarousel;
