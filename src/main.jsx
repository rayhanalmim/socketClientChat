import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import routes from "./routes/routes";
import { ThemeProvider, AuthContextProvider } from "@antopolis/admin-component-library/dist/contexts";
import { CLRouterProvider } from "@antopolis/admin-component-library/dist/helper";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";

import "@antopolis/admin-component-library/dist/index.css";
import "react-toastify/dist/ReactToastify.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthContextProvider>
        <CLRouterProvider router={routes} />
        <Toaster richColors /> {/* Sonner Toast */}
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition="slide"  
        />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
