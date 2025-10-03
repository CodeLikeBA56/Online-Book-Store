import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function QuantitySelector({ quantity, onIncrement, onDecrement, size }) {
  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        style={[
          styles.quantityBtn,
          { borderColor: 'white', borderRightWidth: 1 },
          {
            height: size === 'large' ? 40 : 28,
            width: size === 'large' ? 35 : 30,
          },
        ]}
        onPress={onDecrement}>
        <Text style={styles.btnInnerText}>-</Text>
      </TouchableOpacity>
      <Text
        style={[styles.quantityText, { width: size === 'large' ? 60 : 40 }]}>
        {quantity}
      </Text>
      <TouchableOpacity
        style={[
          styles.quantityBtn,
          { borderColor: 'white', borderLeftWidth: 1 },
          {
            height: size === 'large' ? 40 : 28,
            width: size === 'large' ? 35 : 30,
          },
        ]}
        onPress={onIncrement}>
        <Text style={styles.btnInnerText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quantityContainer: {
    marginRight: 15,
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FFAD01',
  },
  quantityBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInnerText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
});

export default QuantitySelector;