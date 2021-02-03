import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';

import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const valueTotal = products.reduce((accumalator, current) => {
      return accumalator + current.quantity * current.price;
    }, 0);
    console.log(valueTotal, 'precoFl ');
    return formatValue(valueTotal);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const total = products.reduce(
      (accumulator, current) => current.quantity,
      0,
    );
    console.log(total);
    return total;
  }, [products]);

  // const cartTotal = useMemo(() => {
  //   const valueTotal = products.reduce((accumalator, current): number => {
  //     const valueSubtotal = current.price * current.quantity;
  //     return valueSubtotal;
  //   }, 0);
  //   console.log(valueTotal, 'valor');
  //   return formatValue(valueTotal);
  // }, [products]);

  // const totalItensInCart = useMemo(() => {
  //   const total = products.reduce((accumulator, current) => {
  //     const productQuantity = current.quantity;
  //     return productQuantity;
  //   }, 0);
  //   console.log(total, 'cart');
  //   return total;
  // }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
