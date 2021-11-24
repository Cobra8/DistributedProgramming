import { Box, Flex } from "@chakra-ui/layout";
import { Button, Textarea } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Frontend } from "../../components/Frontend";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";
import { __backend__ } from "../../constants";
import { interfacesAdd, interfacesRemove } from "../../requests";

enum InterfaceRequest {
  ADD = 0,
  REMOVE = 1,
}

const InterfacesIndex = () => {
  const [response, setResponse] = useState("");

  const interfaceRequest = async (values: {
    request: InterfaceRequest;
    src_identifier: string;
    dst_identifier: string;
    dst_name: string;
  }) => {
    switch (values.request) {
      case InterfaceRequest.ADD:
        return await interfacesAdd(values);
      case InterfaceRequest.REMOVE:
        return await interfacesRemove(values);
    }
  };

  return (
    <Frontend siteTitle="Interfaces" variant="wide">
      <Box paddingBottom={4} marginBottom={8} borderBottom="1px solid lightgray">
        Add interfaces to existing routers to create links between routers. The API endpoints are reachable through{" "}
        {__backend__ + "interfaces"}.
      </Box>

      <Flex flexDirection="row">
        <Box width="50%" paddingRight={8}>
          <Formik
            initialValues={{ request: InterfaceRequest.ADD, src_identifier: "", dst_identifier: "", dst_name: "" }}
            onSubmit={async (values) => {
              const result = await interfaceRequest(values);

              if (result.status === 200) {
                setResponse("Success: " + result.data.success);
              } else {
                setResponse("Statuscode: " + result.status + "\nMessage: " + result.data.error);
              }
            }}
          >
            {(props) => (
              <Form>
                <SelectField name="request" label="Request to send to the router:">
                  <option value={InterfaceRequest.ADD}>Add an interface to a router</option>
                  <option value={InterfaceRequest.REMOVE}>Remove an interface from a router</option>
                </SelectField>

                <InputField name="src_identifier" label="Source router identifier:" />
                {props.values.request === InterfaceRequest.ADD && (
                  <InputField name="dst_identifier" label="Destination router identifier:" />
                )}
                <InputField name="dst_name" label="Destination name:" />

                <Button type="submit" isLoading={props.isSubmitting} marginTop={4} marginBottom={2}>
                  Send request
                </Button>
              </Form>
            )}
          </Formik>
        </Box>

        <Box width="50%" paddingLeft={8}>
          <Textarea
            placeholder="The result is going to appear here."
            value={response}
            readOnly
            height="200px"
            resize="none"
          ></Textarea>

          <Button marginY={2} onClick={() => setResponse("")}>
            Clear
          </Button>
        </Box>
      </Flex>
    </Frontend>
  );
};

export default InterfacesIndex;
