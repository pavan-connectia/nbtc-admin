import React from "react";
import { Heading, Text } from "..";

const Form = ({ children, formTitle, formDescription }) => {
  return (
    <div className="z-40 overflow-y-auto rounded-lg bg-white p-5 shadow-lg md:px-8">
      {formTitle && <Heading className="mt-3 text-lg">{formTitle}</Heading>}
      {formDescription && <Text>{formDescription}</Text>}

      <div className="z-40 overflow-y-auto p-1">{children}</div>
    </div>
  );
};

export default Form;
