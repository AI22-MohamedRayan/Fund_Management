import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { FundProvider } from "@/contexts/FundContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <FundProvider>
        <Component {...pageProps} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0E1B33",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "10px",
            },
            success: { iconTheme: { primary: "#0F7A6E", secondary: "#fff" } },
            error: { iconTheme: { primary: "#B4322F", secondary: "#fff" } },
          }}
        />
      </FundProvider>
    </AuthProvider>
  );
}
