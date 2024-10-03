import { StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import PlusMinusButton from "../PlusMinusButton";
import EditItemModal from "./EditItemModal";
import { Item } from "@/model/Item";
import { Category } from "@/model/category";

interface ItemProps {
    item: Item;
    categoryName: string;
    handleChangeQuantity: (quantity: number) => void;
    handleEditItem: (item: Item, category: Category) => void;
    handleRemoveItem: () => void;
}

export default function ItemList(props: ItemProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();

    return (
        <View style={[styles.item, { backgroundColor: settingsCtx.theme.colors.items.background }]}>
            {editionModeCtx && (
                <EditItemModal
                    item={props.item}
                    categoryName={props.categoryName}
                    edit={props.handleEditItem}
                    remove={props.handleRemoveItem}
                />
            )}
            <Text style={styles.name}>{props.item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton
                    onPress={() => props.handleChangeQuantity(-1)}
                    plus={false}
                />
                <Text style={styles.quantity}>{props.item.quantity}</Text>
                <PlusMinusButton
                    onPress={() => props.handleChangeQuantity(1)}
                    plus={true}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        height: 50,
        width: "100%",
    },
    name: {
        flexGrow: 4,
        fontSize: 15,
        marginLeft: 10,
    },
    quantityBox: {
        flexDirection: "row",
        width: "30%",
        alignItems: "center",
        justifyContent: "space-around",
    },
    quantity: {
        textAlign: "center",
        width: "20%",
        fontSize: 15,
    },
});
