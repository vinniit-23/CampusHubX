import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <AppRoutes />
      {/* Defines how notifications look */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#10B981", color: "white" } },
          error: { style: { background: "#EF4444", color: "white" } },
        }}
      />
    </>
  );
}

export default App;
