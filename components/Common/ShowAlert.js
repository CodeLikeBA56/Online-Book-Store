import React from 'react';
import { Alert } from 'react-native';

const ShowAlert = ({ title, description, onConfirm }) => {
  const handleAlert = () => {
    Alert.alert(
      title,
      description,
      [
        { text: 'Cancel', onPress: () => onConfirm(false), style: 'cancel' },
        { text: 'Delete', onPress: () => onConfirm(true), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  React.useEffect(() => {
    handleAlert();
  });

  return null;
};

export default ShowAlert;
