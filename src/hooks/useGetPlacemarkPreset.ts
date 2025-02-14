import { getColorByCost } from "./useGetColorByCost.ts";

type GetPlacemarkPresetType = (isSelected: boolean | null, cost: number | undefined) => string;

export const getPlacemarkPreset: GetPlacemarkPresetType = (isSelected, cost) => {
    if (isSelected) {
        return "islands#blueIcon"; // Выбранная остановка
    }
    return getColorByCost(cost ?? -1);
};