import { StyleSheet, useColorScheme } from "react-native"
import { Card } from "react-native-paper";
import { Text } from "./Themed"
import Item from "../models/Item";
import Ionicons from "@expo/vector-icons/Ionicons";
import i18n from "../I18n";
import Colors from "../constants/Colors";

const itemSize = 110

export default function GridItem({item}: {item?: Item}) {
  const colorScheme = useColorScheme()
  const iconColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint

  if (item) {
    return (
      <Card style={styles.card} key={`item-${item.name}`}>
        <Card.Content style={{alignItems: "center"}}>
          <Text>{item.name} ({item.quantity})</Text>
          {/*@ts-ignore*/}
          {item.icon ? <Ionicons name={item.icon} size={30} color={iconColor}/> : ''}
        </Card.Content>
      </Card>
    )
  } else {
    return (
      <Card style={styles.card} key={`newitem`}>
        <Card.Content style={{alignItems: "center"}}>
          <Text>{i18n.t('item.new')}</Text>
          <Ionicons name="add" size={30} color={iconColor}/>
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    height: itemSize,
    width: itemSize,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
});