import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { switchColors } from "@/styles/colors";
import { useSettingsContext } from "@/contexts/settingsContext";
import { setCardViewSetting } from "@/dataaccess/settingsRepository";

export default function CardViewSetting() {
    const { settingsCtx, setSettingsCtx } = useSettingsContext();
    const [cardsView, setCardsView] = useState(false);

    useEffect(() => {
        setCardsView(settingsCtx.cardsView);
    }, []);

    const handleCardsView = (value: boolean) => {
        setCardsView(value);
        setCardViewSetting(value);
        settingsCtx.cardsView = value;
        setSettingsCtx(settingsCtx);
    };

    return (
        <View
            style={[
                styles.item,
                {
                    backgroundColor: settingsCtx.theme.colors.items.background,
                },
            ]}
        >
            <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>Cards view</Text>
            <Switch
                trackColor={switchColors.track}
                thumbColor={cardsView ? switchColors.thumb.true : switchColors.thumb.false}
                onValueChange={handleCardsView}
                value={cardsView}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        height: 80,
    },
    itemText: {
        fontSize: 16,
    },
});
