import { PaperProvider } from 'react-native-paper';

import Inventory from './screens/Inventory'

export default function HomeScreen() {
  return (
    <PaperProvider>
      <Inventory/>
    </PaperProvider>
  );
}