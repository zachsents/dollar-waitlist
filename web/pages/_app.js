import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import "@web/modules/firebase"
import { fire } from "@web/modules/firebase"
import "@web/styles/globals.css"
import { mantineTheme } from "@web/theme"
import { QueryClient, QueryClientProvider } from "react-query"
import { FirebaseProvider } from "@zachsents/fire-query"
import Head from "next/head"


const queryClient = new QueryClient()


export default function MyApp({ Component, pageProps }) {
    return (<>
        <Head>
            <title key="title">Dollar Waitlist</title>
        </Head>
        <QueryClientProvider client={queryClient}>
            <FirebaseProvider
                auth={fire.auth}
                firestore={fire.db}
                functions={fire.functions}
            >
                <MantineProvider theme={mantineTheme} withNormalizeCSS withGlobalStyles withCSSVariables>
                    <ModalsProvider modals={modals}>
                        {/* This wrapper makes the footer stick to the bottom of the page */}
                        <div className="min-h-screen flex flex-col">
                            <Component {...pageProps} />
                        </div>
                        <Notifications autoClose={3000} />
                    </ModalsProvider>
                </MantineProvider>
            </FirebaseProvider>
        </QueryClientProvider>
    </>)
}

const modals = {

}
