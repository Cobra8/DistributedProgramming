import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Form, Formik } from "formik";
import NextDynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { Frontend } from "../components/Frontend";
import { InputField } from "../components/InputField";
import { Router, Selectable, Selected } from "../constants";
import {
  interfacesAdd,
  interfacesRemove,
  routersBroadcast,
  routersStart,
  routersStatus,
  routersStop,
  routersUpdate,
} from "../requests";

const FrontendForceGraph = NextDynamic(() => import("../components/FrontendForceGraph"), {
  ssr: false, // to make sure the ForceGraph library is compiled and rendered in the browser and not on the server!
});

const Index = () => {
  // const [routers, setRouters] = useState([] as string[]);
  const [routers, setRouters] = useState([] as string[]);
  const [routerData, setRouterData] = useState([] as Router[]);
  const [selected, setSelected] = useState({ type: Selectable.NONE } as Selected);
  const [linking, setLinking] = useState(false);

  const { isOpen: isRouterModal, onOpen: newRouter, onClose: closeRouterModal } = useDisclosure();

  useEffect(() => {
    status();
  }, [routers]); // use routers as dependency, meaning that this effect is only called when the routers state changed

  // do not break memoization by creating a new different function on every render, instead with the useCallback hook we only create a new function when the value of linking changes
  const selectCallback = useCallback(
    async (newSelected: Selected) => {
      if (linking && newSelected.type === Selectable.ROUTER) {
        await interfacesAdd({
          src_identifier: selected.id,
          dst_identifier: newSelected.id,
          dst_name: newSelected.name,
        });
        await status();
      }
      setLinking(false);
      setSelected(newSelected);
    },
    [linking]
  );

  const status = async () => {
    setRouterData(
      await Promise.all(
        routers.map(async (identifier) => {
          const response = await routersStatus({ identifier: identifier });
          return response.status === 200
            ? { identifier: identifier, ...response.data }
            : { identifier: "error", name: "status: " + response.status, interfaces: [], table: [] };
        })
      )
    );
  };

  const broadcast = async () => {
    await Promise.all(routers.map(async (identifier) => await routersBroadcast({ identifier })));
    status();
  };

  const update = async () => {
    await Promise.all(routers.map(async (identifier) => await routersUpdate({ identifier })));
    status();
  };

  return (
    <>
      <Modal isOpen={isRouterModal} onClose={closeRouterModal} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent top="10vh">
          <ModalHeader>Add new router</ModalHeader>
          <ModalCloseButton />

          <Formik
            initialValues={{ identifier: "", name: "" }}
            onSubmit={async (values) => {
              await routersStart(values);
              setRouters([...routers, values.identifier]);
              closeRouterModal();
            }}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <InputField name="identifier" label="Identifier:" />
                  <InputField name="name" label="Logical Name:" />
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" isLoading={props.isSubmitting} colorScheme="green" marginRight={4}>
                    Create
                  </Button>
                  <Button colorScheme="red" variant="ghost" onClick={closeRouterModal}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>

      <Frontend siteTitle="Overview" variant="wide">
        <Box marginBottom={6}>
          Welcome to the frontend page of our project for the concurrent and distributed programming course
        </Box>

        <Heading as="h2" size="lg" marginBottom={4}>
          Visualization
        </Heading>

        <Flex flexDirection="row">
          <Box width="75%" paddingRight={5}>
            <Box
              border="1px solid #D4F1F4"
              boxShadow="rgba(172, 236, 242, 0.4) -10px 10px, rgba(172, 236, 242, 0.3) -20px 20px, rgba(172, 236, 242, 0.2) -30px 30px, rgba(172, 236, 242, 0.1) -40px 40px"
            >
              <FrontendForceGraph data={routerData} onSelect={selectCallback} />
            </Box>
          </Box>
          <Box width="25%" paddingLeft={5} borderLeft="1px solid black">
            <Heading as="h4" size="md" marginBottom={4} textAlign="center">
              Control
            </Heading>
            {linking ? (
              <>
                <Box>
                  Select a target router to which the new link outgoing from {selected.name} should be established!
                </Box>
                <Button onClick={() => setLinking(false)} colorScheme="red" marginY={2}>
                  Cancel
                </Button>
                <Box fontSize="10px">(Selecting an existing link between two routers will also stop linking mode)</Box>
              </>
            ) : (
              <>
                {selected.type === Selectable.NONE ? (
                  <Box marginBottom={4}>
                    Select routers or links between routers by simply clicking on them to start interacting!
                  </Box>
                ) : (
                  <Box marginBottom={4}>
                    <Heading as="h6" size="sm" marginBottom={2} borderBottom="1px solid lightgray">
                      Selected:
                    </Heading>
                    <Box>{readableSelected(selected)}</Box>
                  </Box>
                )}
                <Box marginBottom={4}>
                  <Heading as="h6" size="sm" marginBottom={2} borderBottom="1px solid lightgray">
                    Routers:
                  </Heading>
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      newRouter();
                    }}
                    colorScheme="green"
                    marginBottom={2}
                  >
                    Add new router
                  </Button>
                  {selected.type === Selectable.ROUTER && (
                    <Button
                      colorScheme="red"
                      marginBottom={2}
                      onClick={async () => {
                        await routersStop({ identifier: selected.id });
                        setRouters(routers.filter((router) => router !== selected.id));
                        setSelected({ type: Selectable.NONE } as Selected);
                      }}
                    >
                      Remove selected router ({selected.name})
                    </Button>
                  )}
                </Box>

                {(selected.type === Selectable.ROUTER || selected.type === Selectable.LINK) && (
                  <Box marginBottom={4}>
                    <Heading as="h6" size="sm" marginBottom={2} borderBottom="1px solid lightgray">
                      Interfaces (links between routers):
                    </Heading>
                    {selected.type === Selectable.ROUTER && (
                      <Button colorScheme="green" marginBottom={2} onClick={() => setLinking(true)}>
                        Add new interface to {selected.name}
                      </Button>
                    )}

                    {selected.type === Selectable.LINK && (
                      <Button
                        colorScheme="red"
                        marginBottom={2}
                        onClick={async () => {
                          await interfacesRemove({ src_identifier: selected.source.id, dst_name: selected.name });
                          setSelected({ type: Selectable.NONE } as Selected);
                          await status();
                        }}
                      >
                        Remove selected interface ({selected.name})
                      </Button>
                    )}
                  </Box>
                )}

                <Box marginBottom={4}>
                  <Heading as="h6" size="sm" marginBottom={2} borderBottom="1px solid lightgray">
                    Network actions:
                  </Heading>
                  <Button colorScheme="cyan" marginBottom={2} onClick={() => status()}>
                    Request status from all nodes
                  </Button>
                  <Button colorScheme="cyan" marginBottom={2} onClick={() => broadcast()}>
                    Request broadcast on all nodes
                  </Button>
                  <Button colorScheme="cyan" marginBottom={2} onClick={() => update()}>
                    Request update on all nodes
                  </Button>
                </Box>

                {process.env.NODE_ENV != "production" && (
                  <Box marginBottom={4}>
                    <Heading as="h6" size="sm" marginBottom={2} borderBottom="1px solid lightgray">
                      Dev actions:
                    </Heading>
                    <Button
                      colorScheme="gray"
                      marginBottom={2}
                      onClick={async () => {
                        await setupTestNetwork();
                        setRouters(["a", "b", "c", "d", "e", "f", "g"].map((char) => "router_" + char));
                      }}
                    >
                      Setup test network
                    </Button>
                    <Button colorScheme="gray" marginBottom={2} onClick={() => setRouters([])}>
                      Clear network
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Flex>
      </Frontend>
    </>
  );
};

const readableSelected = (selected: Selected) => {
  return selected.type === Selectable.ROUTER ? (
    <>
      <Box>Type: Router</Box>
      <Box>ID: {selected.id}</Box>
      <Box>Name: {selected.name}</Box>
    </>
  ) : (
    <>
      <Box>Type: Link</Box>
      <Box>ID: {selected.id}</Box>
      <Box>Name: {selected.display}</Box>
      <Box>Source: {selected.source.name}</Box>
      <Box>Target: {selected.target.name}</Box>
    </>
  );
};

const setupTestNetwork = async () => {
  await routersStart({ identifier: "router_a", name: "London" });
  await routersStart({ identifier: "router_b", name: "Amsterdam" });
  await routersStart({ identifier: "router_c", name: "Bern" });
  await routersStart({ identifier: "router_d", name: "Berlin" });
  await routersStart({ identifier: "router_e", name: "San Francisco" });
  await routersStart({ identifier: "router_f", name: "Oslo" });
  await routersStart({ identifier: "router_g", name: "Sidney" });

  await interfacesAdd({ src_identifier: "router_b", dst_identifier: "router_c", dst_name: "Bern" });
  await interfacesAdd({ src_identifier: "router_b", dst_identifier: "router_d", dst_name: "Berlin" });
  await interfacesAdd({ src_identifier: "router_b", dst_identifier: "router_e", dst_name: "San Francisco" });

  await interfacesAdd({ src_identifier: "router_e", dst_identifier: "router_f", dst_name: "Oslo" });
  await interfacesAdd({ src_identifier: "router_f", dst_identifier: "router_g", dst_name: "Sidney" });
  await interfacesAdd({ src_identifier: "router_g", dst_identifier: "router_a", dst_name: "London" });
  await interfacesAdd({ src_identifier: "router_a", dst_identifier: "router_b", dst_name: "Amsterdam" });
};

export default Index;
