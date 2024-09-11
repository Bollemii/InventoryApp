import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import {
    getCardViewSetting,
    setCardViewSetting,
} from "@/dataaccess/settingsRepository";
import { colors } from "@/styles/colors";

export default function Settings() {
    const [cardsView, setCardsView] = useState(false);

    useEffect(() => {
        getCardViewSetting().then(setCardsView);
    }, []);

    const handleCardsView = (value: boolean) => {
        setCardsView(value);
        setCardViewSetting(value);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.itemText}>Cards view</Text>
                <Switch
                    trackColor={{ true: "#4A85EB", false: "#767577" }}
                    thumbColor={cardsView ? "#1545D5" : "#F4F3F4"}
                    onValueChange={handleCardsView}
                    value={cardsView}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 10,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 16,
    },
});
