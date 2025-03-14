import "primereact/resources/themes/lara-light-blue/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css"; // Core PrimeReact styles
import "primeicons/primeicons.css"; // PrimeIcons

import { PrimeReactProvider } from "primereact/api";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
}
