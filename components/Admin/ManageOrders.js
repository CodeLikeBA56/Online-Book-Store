import { Entypo } from '@expo/vector-icons';
import Searchbar from '../Common/Searchbar';
import { useEffect, useState, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useThemeContext } from '../../Contexts/ThemeContext';
import { useInventoryContext } from '../../Contexts/InventoryContext';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ManageOrders = () => {
  const { theme } = useThemeContext();
  const { findBookById } = useInventoryContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Orders.json`);
        const data = await response.json();
        const fetchedOrders = Object.values(data || {}).filter(order => order.orderStatus !== 'Cancelled By User');
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      if(status === 'Shipped') {
        const orderResponse = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Orders/${orderId}.json`);
        const orderData = await orderResponse.json();

        const products = orderData.orderedProducts;

        for (const product of products) {
          const productQuantity = findBookById(product.id).quantity;
          await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Books/${product.id}.json`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: (productQuantity - product.quantity),
            }),
          });
        }
      }

      await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Orders/${orderId}/orderStatus.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const RenderProduct = ({ item }) => (
    <View style={[styles.productContainer, { borderBottomColor: theme.borderColor }]}>
      <Text style={[styles.productName, { color: theme.textColor }]}>{item.name}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.productPrice, { color: theme.textColor }]}>Rs: {item.price}</Text>
        <Text style={[styles.productQuantity, { color: theme.textColor }]}>Quantity: {item.quantity}</Text>
      </View>
    </View>
  );

  function RenderOrder({ order }) {
    const pickerRef = useRef();
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order.orderStatus);

    const handlePickerChange = (itemValue) => {
      setOrderStatus(itemValue);
      updateOrderStatus(order.orderId, itemValue);
      setIsPickerOpen(false);
    };

    const togglePicker = () => setIsPickerOpen(!isPickerOpen);
    return (
      <View style={[styles.orderContainer, { backgroundColor: theme.primary, borderColor: theme.borderColor }]}>
        <View style={styles.header}>
          <Text style={[styles.orderId, { color: theme.textColor }]}>Order ID: {order.orderId}</Text>
          <TouchableOpacity onPress={togglePicker} style={styles.statusButton}>
            <Text style={[styles.orderState, { color: '#01a78c' }]}>{orderStatus}</Text>
            <Entypo name="chevron-down" size={24} color='#01a78c' />
          </TouchableOpacity>
        </View>

        {isPickerOpen && (
          <Picker
            selectedValue={orderStatus}
            style={[styles.picker, { color: theme.textColor, backgroundColor: theme.primary, zIndex: 999 }]}
            onValueChange={handlePickerChange}
            ref={pickerRef}
          >
            <Picker.Item color={theme.textColor} label="Pending" value="Pending" />
            <Picker.Item color={theme.textColor} label="Processing" value="Processing" />
            <Picker.Item color={theme.textColor} label="Shipped" value="Shipped" />
            <Picker.Item color={theme.textColor} label="Delivered" value="Delivered" />
            <Picker.Item color={theme.textColor} label="Cancelled" value="Cancelled" />
          </Picker>
        )}
        <FlatList
          data={order.orderedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={RenderProduct}
        />
        <View style={{ marginTop: 12 }}>
          <Text style={{ marginLeft: 'auto', borderWidth: 2, borderColor: '#01a78c', borderRadius: 5, padding: 5, color: '#01a78c', fontWeight: '700' }}>Total Price: {order.amount}</Text>
        </View>
      </View>
    );
  }

  const [filteredOrder, setFilteredOrder] = useState(null);
  const handleManageOrderSearchbar = (searchedKeyword) => {
    const trimmedKeyword = searchedKeyword.trim();
    const isValidOrderNumber = /^[0-9]+$/.test(trimmedKeyword);

    if (trimmedKeyword.length > 0 && isValidOrderNumber) {
      const filter = orders.filter((order) => trimmedKeyword.includes(order.orderId));
      setFilteredOrder(filter);
    } else {
      setFilteredOrder(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Searchbar enableGoBack={true} searchbar={true} logout={true} handleFilteredData={handleManageOrderSearchbar} />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrder === null ? orders : filteredOrder}
          style={{ paddingTop: 20, paddingBottom: 30 }}
          keyExtractor={(item) => item.orderId}
          renderItem={({ item }) => <RenderOrder order={item} />}
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.textColor }]}>No orders available</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderContainer: {
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: screenWidth - 20,
    alignSelf: 'center',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  statusButton: {
    paddingLeft: 3,
    borderWidth: 2,
    paddingRight: 3,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#01a78c',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderState: {
    padding: 3,
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 14,
    fontWeight: '800',
  },
  picker: {
    height: 121,
    width: '49%',
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderTopRightRadius: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 37,
    right: 16,
    borderColor: '#01a78c',
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productContainer: {
    padding: 6,
    borderBottomWidth: 1,
  },
  productName: {
    fontSize: 15,
    marginBottom: 3,
    fontWeight: '700',
  },
  productPrice: {
    fontSize: 13,
  },
  productQuantity: {
    fontSize: 13,
  },
});

export default ManageOrders;