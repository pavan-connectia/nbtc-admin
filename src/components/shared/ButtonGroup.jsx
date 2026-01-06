import React from "react";
import { Button } from "..";

const ButtonGroup = ({
  negativeLabel = "Close",
  positiveLabel = "Save",
  negativeClick,
  positiveClick,
}) => {
  return (
    <div className="flex w-full flex-col gap-3 pt-5 sm:flex-row">
      <Button variant="outline" className="w-full" onClick={negativeClick}>
        {negativeLabel}
      </Button>
      <Button
        className="w-full"
        type={positiveClick ? "button" : "submit"}
        onClick={positiveClick}
      >
        {positiveLabel}
      </Button>
    </div>
  );
};

export default ButtonGroup;
