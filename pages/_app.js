import "../styles/style.css";
import "../styles/create.css";
import "../styles/index.css";
import { Provider } from "@self.id/framework";

function MyApp({ Component, pageProps }) {
  return (
    <Provider client={{ ceramic: "testnet-clay" }}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
