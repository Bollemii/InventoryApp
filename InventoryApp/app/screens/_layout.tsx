import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import i18n from '../../I18n';

const tabIconSize = 28

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="Inventory"
        options={{
          title: i18n.t('title.inventory'),
          //@ts-ignore
          tabBarIcon: ({ color }) => <Ionicons size={tabIconSize} style={{ marginBottom: -3 }} name='list' color={color}/>,
        }}
      />
      <Tabs.Screen
        name="Complete"
        options={{
          title: i18n.t('title.complete'),
          //@ts-ignore
          tabBarIcon: ({ color }) => <Ionicons size={tabIconSize} style={{ marginBottom: -3 }} name='checkmark' color={color}/>,
        }}
      />
    </Tabs>
  );
}
