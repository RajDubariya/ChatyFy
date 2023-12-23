import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { GroupContextProvider } from "./context/GroupContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ChatContextProvider>
        <GroupContextProvider>
          <App />
        </GroupContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
