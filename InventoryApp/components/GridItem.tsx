import { StyleSheet, useColorScheme } from "react-native"
import { Card } from "react-native-paper";
import { Text } from "./Themed"
import Item from "../models/Item";
import Ionicons from "@expo/vector-icons/Ionicons";
import i18n from "../I18n";
import Colors from "../constants/Colors";

const itemSize = 100
const itemIconSize = 30

export default function GridItem({item}: {item?: Item}) {
  const colorScheme = useColorScheme()
  const iconColor = Colors[colorScheme ?? 'light'].tint

  if (item) {
    return (
      <Card style={styles.card} key={`item-${item.name}`}>
        <Card.Content style={styles.content}>
          <Text>{item.name} ({item.quantity})</Text>
          {/*@ts-ignore*/}
          {item.icon ? <Ionicons name={item.icon} size={itemIconSize} color={iconColor}/> : ''}
        </Card.Content>
      </Card>
    )
  } else {
    return (
      <Card style={styles.card} key={`newitem`}>
        <Card.Content style={styles.content}>
          <Text>{i18n.t('item.add')}</Text>
          <Ionicons name="add" size={itemIconSize} color={iconColor}/>
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
  content: {
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
  }
});