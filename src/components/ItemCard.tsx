import { StyleSheet, Text, View } from "react-native";

import { Item } from "@/model/Item";
import PlusMinusButton from "./PlusMinusButton";
import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import DeleteItemButton from "./DeleteItemButton";

interface ItemProps {
    itemIndex: number;
    item: Item;
    handleChangeQuantity: (itemIndex: number, quantity: number) => void;
    handleRemoveItem: (itemIndex: number) => void;
}

const SIZE = 110;

export default function ItemCard(props: ItemProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();

    return (
        <View style={[styles.item, { backgroundColor: settingsCtx.theme.colors.items.background, height: editionModeCtx ? SIZE+10 : SIZE }]}>
            <Text style={styles.name}>{props.item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton
                    onPress={() => props.handleChangeQuantity(props.itemIndex, -1)}
                    plus={false}
                />
                <Text style={styles.quantity}>{props.item.quantity}</Text>
                <PlusMinusButton
                    onPress={() => props.handleChangeQuantity(props.itemIndex, 1)}
                    plus={true}
                />
            </View>
            {editionModeCtx && (
                <DeleteItemButton
                    onPress={() => props.handleRemoveItem(props.itemIndex)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 7,
        marginVertical: 5,
        height: SIZE,
        width: SIZE,
    },
    name: {
        width: "100%",
        flexGrow: 1,
        textAlign: "center",
        fontSize: 15,
        marginTop: 5,
    },
    quantityBox: {
        flexDirection: "row",
        width: "100%",
        flexGrow: 2,
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 5,
    },
    quantity: {
        width: "40%",
        textAlign: "center",
        fontSize: 15,
    },
});
