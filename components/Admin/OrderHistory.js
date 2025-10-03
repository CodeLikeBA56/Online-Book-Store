import { useState, useEffect } from 'react';
import Searchbar from '../Common/Searchbar';
import { useThemeContext } from '../../Contexts/ThemeContext';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

function OrderHistory() {
  const { theme } = useThemeContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Orders.json`);
        const data = await response.json();
        const fetchedOrders = Object.values(data || {});
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderSearch = (searchedKeyword) => {
    if (searchedKeyword.trim().length > 0) {
      const keyword = searchedKeyword.toLowerCase();
      const filteredOrders = orders.filter((order) => order.orderId.toString().includes(keyword));
      setFilteredOrders(filteredOrders);
    } else {
      setFilteredOrders(null);
    }
  };

  const renderOrder = ({ item }) => {
    return (
      <View style={[styles.orderContainer, { backgroundColor: theme.primary, borderColor: theme.borderColor }]}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
          <Text style={[styles.orderId, { color: theme.textColor }]}>Order ID: {item.orderId}</Text>
          <Text style={[styles.orderState, { color: '#01a78c' }]}>{item.orderStatus}</Text>
        </View>
        <FlatList
          data={item.orderedProducts}
          keyExtractor={(product) => product.id.toString()}
          renderItem={({ item: product }) => (
            <View style={styles.productContainer}>
              <Text style={[styles.productName, { color: theme.textColor }]}>{product.name}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.productPrice, { color: theme.textColor }]}>Rs: {product.price}</Text>
                <Text style={[styles.productQuantity, { color: theme.textColor }]}>Quantity: {product.quantity}</Text>
              </View>
            </View>
          )}
        />
        <View style={[styles.footer, {borderColor: theme.textColor}]}>
          <Text style={[styles.totalAmount, { color: theme.textColor }]}>Total Price: {item.amount}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Searchbar enableGoBack searchbar handleFilteredData={handleOrderSearch} />
      <FlatList
        data={filteredOrders === null? orders : filteredOrders}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => {
          return (
            <Text style={[styles.emptyText, { color: theme.textColor }]}>
              {(filteredOrders === null)? 'No order history available.' : 'No results found'}
            </Text>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  orderContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: screenWidth - 20,
    alignSelf: 'center',
    minHeight: 120,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderState: {
    padding: 6,
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 8,
    fontWeight: 800,
    borderColor: '#01a78c',
  },
  productContainer: {
    marginBottom: 5,
  },
  productName: {
    fontSize: 15,
    marginBottom: 3,
    fontWeight: 700,
  },
  productPrice: {
    fontSize: 14,
  },
  productQuantity: {
    fontSize: 14,
  },
  footer: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default OrderHistory;