import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Router from "./router/router";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;