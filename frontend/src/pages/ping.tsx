import { Box } from "@chakra-ui/layout";
import { Button, Textarea } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { Frontend } from "../components/Frontend";
import { __json__ } from "../constants";

const Ping = () => {
  const [response, setResponse] = useState("The result is going to appear here.");

  const pingBackend = async () => {
    const result = await axios.get(__json__ + "ping");
    setResponse(result.status === 200 ? JSON.stringify(result.data) : "Antwort ungültig! Statuscode: " + result.status);
  };

  return (
    <Frontend siteTitle="Ping" variant="wide">
      <Box>Click the button below to send a ping to our elixir backend at {__json__ + "ping"}:</Box>
      <Button marginY={4} onClick={() => pingBackend()}>
        Click me!
      </Button>
      <Button marginY={4} marginLeft={6} onClick={() => setResponse("")}>
        Clear
      </Button>

      <Textarea placeholder="The result is going to appear here." value={response} readOnly resize="none"></Textarea>
    </Frontend>
  );
};

export default Ping;
