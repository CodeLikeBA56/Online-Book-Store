import Searchbar from '../Common/Searchbar';
import { StyleSheet, View } from 'react-native';
import { useThemeContext } from '../../Contexts/ThemeContext';

const Dashboard = () => {
  const { theme } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Searchbar logout={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Dashboard;