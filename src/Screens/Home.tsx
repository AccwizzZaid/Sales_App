import React from 'react';
import { Image } from 'react-native';
import Dashboard from './Dashboard';
import Quotation from './Quotation';
import Reminder from './Reminder';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardIcon } from '../../public/icons';


const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Dashboard'
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <DashboardIcon width={20} height={20} fill={"green"} />

          ),
        }}
      />
      <Tab.Screen
        name='Quotation'
        component={Quotation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <DashboardIcon width={size} height={size} fill={color} />

          ),
        }}
      />
      <Tab.Screen
        name='Reminder'
        component={Reminder}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <DashboardIcon width={size} height={size} fill={color} />

          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
