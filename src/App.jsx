import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Router from "./router/router";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
