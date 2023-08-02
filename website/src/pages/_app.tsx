import "styles/globals.css";
import type { AppProps } from "next/app";
import { Chain, EthosConnectProvider } from "ethos-connect";
import Head from "next/head";
import { CustomToast, Sidebar } from "components";
import { SUI_RPC_URL, GOOGLE_ANALYTICS_ID } from "utils";
import { Montserrat, Inter } from "next/font/google";
import NextNProgress from "nextjs-progressbar";
import Script from "next/script";

const font_montserrat = Montserrat({
  variable: "--montserrat-font",
  subsets: ["latin"],
});

const font_inter = Inter({
  variable: "--inter-font",
  subsets: ["latin"],
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${font_montserrat.variable} ${font_inter.variable}`}>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
      />
      <Script strategy="lazyOnload" id="google_analytics">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GOOGLE_ANALYTICS_ID}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>
      <Head>
        <title>¡hola sui! - nft staking platform</title>
        <meta property="og:title" content="hola! ola staking ola!" key="title" />
      </Head>
      <NextNProgress color={"#E15A8C"} height={3} />
      <EthosConnectProvider
        ethosConfiguration={{
          chain: Chain.SUI_MAINNET, // Optional. Defaults to sui:devnet and sui:testnet - permanent testnet
          network: SUI_RPC_URL,
          hideEmailSignIn: true, // Optional.  Defaults to false
          preferredWallets: ["Suiet"],
        }}
      >
        <Sidebar>
          {/* @ts-ignore */}
          <Component {...pageProps} />
        </Sidebar>
      </EthosConnectProvider>
      <CustomToast />
    </div>
  );
}
