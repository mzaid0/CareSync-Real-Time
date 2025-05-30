import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store, persistor } from "./store/index.ts";
import { PersistGate } from "redux-persist/integration/react";

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" richColors duration={3000} />
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);
