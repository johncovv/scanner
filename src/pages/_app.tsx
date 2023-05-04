import type { AppProps } from "next/app";
import Head from "next/head";

import { ToastMessagesProvider } from "@/context/toastMessages.context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Risti Scanner</title>
			</Head>

			<ToastMessagesProvider>
				<Component {...pageProps} />
			</ToastMessagesProvider>
		</>
	);
}
