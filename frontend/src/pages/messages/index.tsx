import { Box, Flex } from "@chakra-ui/layout";
import { Button, Textarea } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Frontend } from "../../components/Frontend";
import { InputField } from "../../components/InputField";
import { __backend__ } from "../../constants";
import { sendMessage } from "../../requests";

const MessagesIndex = () => {
  const [response, setResponse] = useState("");

  return (
    <Frontend siteTitle="Routers" variant="wide">
      <Box paddingBottom={4} marginBottom={8} borderBottom="1px solid lightgray">
        Send messages from one router to annother by having the messages routed through the generated routing tables.
        The API endpoint is reachable through {__backend__ + "messages"}.
      </Box>

      <Flex flexDirection="row">
        <Box width="50%" paddingRight={8}>
          <Formik
            initialValues={{ src_identifier: "", dst_name: "", message: "" }}
            onSubmit={async (values) => {
              const result = await sendMessage(values);

              if (result.status === 200) {
                setResponse("Success: " + result.data.success);
              } else {
                setResponse("Statuscode: " + result.status + "\nMessage: " + result.data.error);
              }
            }}
          >
            {(props) => (
              <Form>
                <InputField name="src_identifier" label="Source router identifier:" />
                <InputField name="dst_name" label="Destination name:" />
                <InputField name="message" label="Message:" />

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

export default MessagesIndex;
