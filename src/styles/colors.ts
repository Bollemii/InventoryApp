import { Theme } from "@/types/theme";

export const colorScheme: { [key: string]: Theme } = {
    dark: {
        name: "dark",
        colors: {
            background: "#8B8B8B",
            headers: {
                background: "#424242",
                elements: "#FFFFFF",
                selected: "#4285F4",
            },
            texts: "#212121",
            items: {
                background: "#BBBBBB",
                button: {
                    normal: "#FFFFFF",
                    pressed: "#A9A9A9",
                    icon: "#000000",
                },
            },
        },
    },
    light: {
        name: "light",
        colors: {
            background: "#FFFFFF",
            headers: {
                background: "#8B8B8B",
                elements: "#212121",
                selected: "#8B8B8B",
            },
            texts: "#212121",
            items: {
                background: "#BBBBBB",
                button: {
                    normal: "#D3D3D3",
                    pressed: "#808080",
                    icon: "#000000",
                },
            },
        },
    },
};
