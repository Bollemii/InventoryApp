import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import i18n from '../../I18n'
import GridList from '../../components/GridList';
import Item from '../../models/Item';
import Inventory from '../../models/Inventory';

const items: Array<Item> = [
  new Item('pull', 3),
  new Item('t-shirt', 5),
  new Item('slip', undefined, 'heart'),
  new Item('chaussettes'),
  new Item('pantalon', 1)
]
const inventory = new Inventory()
items.forEach(i => inventory.addItem(i))

export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ i18n.t('title.home') }</Text>
      <View style={styles.list}>
        <GridList inventory={inventory}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    background: '#fff',
    justifyContent: 'center',
  },
});