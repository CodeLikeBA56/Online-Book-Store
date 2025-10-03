import { useState, useEffect } from 'react';
import Searchbar from '../Common/Searchbar';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Text, View, FlatList, Alert } from 'react-native';
import { useThemeContext } from '../../Contexts/ThemeContext';

const Users = () => {
  const { theme } = useThemeContext();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users.json`);
        const data = await response.json();
        setUsers(Object.values(data).filter(user => user !== null && user.email !== '211400068@gift.edu.pk'));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteUser(userId) }
      ]
    );
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userId}.json`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user.phone !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUserSearch = (searchedKeyword) => {
    if (searchedKeyword.trim().length > 0) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchedKeyword.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(null);
    }
  };

  const User = ({ user }) => (
    <View style={[styles.userDetails, { borderColor: '#222' }]}>
      <View style={styles.userInfo}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 20}}>
          <Text style={[styles.username, { color: theme.textColor }]}>{user.username}</Text>
          <Text style={[styles.phone, { color: '#01a78c' }]}>+92 {user.phone}</Text>
        </View>
        <Text style={[styles.email, { color: theme.textColor }]}>{user.email}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Searchbar logout={true} searchbar={true} handleFilteredData={handleUserSearch} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          data={filteredUsers === null ? users : filteredUsers}
          keyExtractor={(item) => item.phone.toString()}
          renderItem={({ item }) => <User user={item} />}
          ListEmptyComponent={() => <Text style={[styles.emptyList, { color: theme.textColor }]}>No users found.</Text>}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '800',
  },
  phone: {
    padding: 3,
    fontSize: 13,
    fontWeight: 500,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#01a78c"
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  emptyList: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Users;