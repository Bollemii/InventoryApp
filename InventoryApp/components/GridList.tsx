import { StyleSheet } from "react-native";
import { View } from "./Themed";
import GridItem from "./GridItem";
import Inventory from "../models/Inventory";

export default function GridList({inventory}: {inventory: Inventory}) {
  return (
    <View style={styles.container}>
      {inventory.items.map((item) => {return(<GridItem item={item} key={`item-${item.name}`}/>)})}
      <GridItem key={`newitem`}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    flexWrap: "wrap",
    justifyContent: "center",
  }
})