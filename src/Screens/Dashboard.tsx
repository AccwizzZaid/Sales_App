import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store'; // Adjust the path according to your structure

const Dashboard = () => {
  const username = useSelector((state: RootState) => state.user.username);

  return (
    <View>
      <Text>This is Dashboard</Text>
      <Text>Username: {username}</Text>
    </View>
  );
};

export default Dashboard;
