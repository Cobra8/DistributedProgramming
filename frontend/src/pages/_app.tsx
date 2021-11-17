import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import theme from "../theme";

function Frontend({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Head>
        <title>Frontend - Concurret and Distributed Programming</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default Frontend;
