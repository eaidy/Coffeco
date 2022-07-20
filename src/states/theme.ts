import { themes, ThemeNames, Theme } from "@/themes";
import { atom } from "jotai";

const activeThemeId = atom<ThemeNames>('light')

export const activeThemeAtom = atom<Theme>(get => {
    const themeId = get(activeThemeId)
    const themeIndex = themes.findIndex(t => t.id === themeId);

    return themeIndex >= 0 ? themes[themeIndex].theme : themes[0].theme;
})

export default activeThemeId;