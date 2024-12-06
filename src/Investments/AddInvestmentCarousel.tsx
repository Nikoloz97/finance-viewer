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
import ManualForm from "./ManualForm";

const AddInvestmentCarousel = () => {
  const [isManualChosen, setIsManualChosen] = useState(false);
  const [isAutomaticChosen, setIsAutomaticChosen] = useState(false);

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
    addInvestmentSteps.push(<div>Automatic file drop</div>);
    addInvestmentSteps.push(<div>Automatic Form</div>);
  } else if (isManualChosen) {
    addInvestmentSteps.push(
      <div>
        <ManualForm />
      </div>
    );
  }

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
            Please follow along steps for adding an investment:
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
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentCarousel;
