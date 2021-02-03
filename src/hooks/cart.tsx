import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storegeProducts = await AsyncStorage.getItem(
        '@GoMarkeplace:products',
      );
      if (storegeProducts) {
        setProducts([...JSON.parse(storegeProducts)]);
      }
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      let addProducts = [...products, product];
      if (products) {
        const productIndex = products.findIndex(
          itemProduct => itemProduct.id === product.id,
        );
        if (productIndex < 0) {
          const addProduct = { ...product };
          addProduct.quantity = 1;
          addProducts = [...products, addProduct];
          setProducts(addProducts);
        } else {
          addProducts = [...products];
          addProducts[productIndex].quantity += 1;
        }
      } else {
        const addProduct = { ...product };
        addProduct.quantity = 1;
        addProducts = [addProduct];
        setProducts(addProducts);
      }
      await AsyncStorage.setItem(
        '@GoMarkeplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productIndex = products.findIndex(
        itemProduct => itemProduct.id === id,
      );
      if (productIndex < 0) return;

      const addProduct = [...products];
      addProduct[productIndex].quantity += 1;
      setProducts(addProduct);

      await AsyncStorage.setItem(
        '@GoMarkeplace:products',
        JSON.stringify(addProduct),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productIndex = products.findIndex(
        itemProduct => itemProduct.id === id,
      );

      if (productIndex <= 0) return;
      let addProduct = [...products];
      addProduct[productIndex].quantity -= 1;

      if (products[productIndex].quantity <= 0) {
        addProduct = products.filter(productCart => productCart.id !== id);
      }
      setProducts(addProduct);

      await AsyncStorage.setItem(
        '@GoMarkeplace:products',
        JSON.stringify(addProduct),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
