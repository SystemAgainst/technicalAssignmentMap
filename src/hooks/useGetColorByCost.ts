export const getColorByCost = (cost: number) => {
    switch (true) {
        case cost <= 5 && cost > 0:
            return "islands#greenIcon";
        case cost > 5 && cost <= 15:
            return "islands#yellowIcon";
        case cost > 15 && cost <= 30:
            return "islands#redIcon";
        case cost > 30:
            return "islands#violetIcon";
        default:
            return "islands#blackIcon"; // Если нет маршрута
    }
};