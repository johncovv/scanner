import type { AppProps } from "next/app";
import Head from "next/head";

import { ToastMessagesProvider } from "@/context/toastMessages.context";
import "@/styles/globals.css";

function PageProviders({ children }: { children: React.ReactNode }) {
	return <ToastMessagesProvider>{children}</ToastMessagesProvider>;
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Risti Projetos</title>
			</Head>

			<PageProviders>
				<Component {...pageProps} />
			</PageProviders>
		</>
	);
}
