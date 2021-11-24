import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Select } from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import React from "react";

type SelectFieldProps = React.InputHTMLAttributes<HTMLSelectElement> & {
  variant?: "block" | "inline";
  name: string;
  label: string;
};

export const SelectField: React.FC<SelectFieldProps> = ({ children, variant = "block", label, ...props }) => {
  const [field, error] = useField(props);
  const formikContext = useFormikContext();

  const changeFunction = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const changed = event.target.value;
    formikContext.setFieldValue(field.name, isNaN(parseInt(changed)) ? changed : parseInt(changed));

    props.onChange && props.onChange(event);
  };
  return (
    <FormControl isInvalid={!!error.error} marginBottom={4}>
      <FormLabel display={variant} htmlFor={field.name} margin={0}>
        {label}
      </FormLabel>
      <Select
        id={field.name}
        variant="flushed"
        focusBorderColor="teal.200"
        borderColor="lightgray"
        width={variant === "inline" ? "auto" : "100%"}
        size="sm"
        isDisabled={props.disabled}
        {...field}
        onChange={changeFunction}
      >
        {children}
      </Select>
      {error.error ? <FormErrorMessage>{error.error}</FormErrorMessage> : null}
    </FormControl>
  );
};
