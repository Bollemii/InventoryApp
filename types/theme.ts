export interface Theme {
    name: string;
    colors: {
        background: string;
        headers: {
            background: string;
            elements: string;
            selected: string;
        };
        texts: string;
        items: {
            background: string;
            button: {
                normal: string;
                pressed: string;
                icon: string;
            };
        };
    };
}
