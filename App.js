import Main from './Main';
import AuthProvider from './Contexts/AuthContext';
import CartProvider from './Contexts/CartContext';
import ThemeProvider from './Contexts/ThemeContext';
import SettingProvider from './Contexts/SettingContext';
import WishlistProvider from './Contexts/WishlistContext';
import InventoryProvider from './Contexts/InventoryContext';

export default function App() {

  return (
    <InventoryProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <SettingProvider>
                        <Main />
              </SettingProvider>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </InventoryProvider>
  );
}