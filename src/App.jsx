import "./assets/styles/globals.scss";
import AuthProvider from "./provider/AuthProvider";
import { ExpenseProvider } from "./provider/ExpenseProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div>
      <AuthProvider>
        <ExpenseProvider>
          <AppRoutes />
        </ExpenseProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
