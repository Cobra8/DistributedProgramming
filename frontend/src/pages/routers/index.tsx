import { Box, Flex } from "@chakra-ui/layout";
import { Button, Textarea } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Frontend } from "../../components/Frontend";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";
import { __backend__ } from "../../constants";
import { routersBroadcast, routersStart, routersStatus, routersStop, routersUpdate } from "../../requests";

enum RouterRequest {
  START = 0,
  STOP = 1,
  BROADCAST = 2,
  UPDATE = 3,
  STATUS = 9,
}

const RoutersIndex = () => {
  const [response, setResponse] = useState("");

  const routerRequest = async (values: { request: RouterRequest; identifier: string; name: string }) => {
    switch (values.request) {
      case RouterRequest.START:
        return await routersStart(values);
      case RouterRequest.STOP:
        return await routersStop(values);
      case RouterRequest.BROADCAST:
        return await routersBroadcast(values);
      case RouterRequest.UPDATE:
        return await routersUpdate(values);
      case RouterRequest.STATUS:
        return await routersStatus(values);
    }
  };

  return (
    <Frontend siteTitle="Routers" variant="wide">
      <Box paddingBottom={4} marginBottom={8} borderBottom="1px solid lightgray">
        Start new routers, stop existing ones and finally request the current status of a router. The API endpoints are
        reachable through {__backend__ + "routers"}.
      </Box>

      <Flex flexDirection="row">
        <Box width="50%" paddingRight={8}>
          <Formik
            initialValues={{ request: RouterRequest.START, identifier: "", name: "" }}
            onSubmit={async (values) => {
              const result = await routerRequest(values);

              if (result.status === 200) {
                if ("success" in result.data) {
                  setResponse("Success: " + result.data.success);
                } else {
                  setResponse(
                    Object.keys(result.data)
                      .flatMap((value) => {
                        return value + ": " + JSON.stringify(result.data[value]);
                      })
                      .join("\n")
                  );
                }
              } else {
                setResponse("Statuscode: " + result.status + "\nMessage: " + result.data.error);
              }
            }}
          >
            {(props) => (
              <Form>
                <SelectField name="request" label="Request to send to the router:">
                  <option value={RouterRequest.START}>Start a router</option>
                  <option value={RouterRequest.STOP}>Stop a router</option>
                  <option value={RouterRequest.BROADCAST}>Let a router broadcast its interfaces to the network</option>
                  <option value={RouterRequest.UPDATE}>Force a router to update its internal routing table</option>
                  <option value={RouterRequest.STATUS}>Retrieve the current status of a router</option>
                </SelectField>

                <InputField name="identifier" label="Identifier:" />
                {props.values.request === RouterRequest.START && <InputField name="name" label="Logical Name:" />}

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

export default RoutersIndex;
