import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "block" | "inline";
  name: string;
  label: string;
};

export const InputField: React.FC<InputFieldProps> = ({ variant = "block", label, size: _, ...props }) => {
  const [field, error] = useField(props);
  return (
    <FormControl isInvalid={!!error.error} marginBottom={4}>
      <FormLabel display={variant} htmlFor={field.name} margin={0}>
        {label}
      </FormLabel>
      <Input
        id={field.name}
        variant="flushed"
        color={props.disabled ? "darkgray" : "black"}
        focusBorderColor="teal.200"
        borderColor="lightgray"
        width={variant === "inline" ? "auto" : "100%"}
        size="sm"
        isDisabled={props.disabled}
        {...field}
        {...props}
      />
      {error.error ? <FormErrorMessage>{error.error}</FormErrorMessage> : null}
    </FormControl>
  );
};
