
export interface Spell {
    id: number;
    name: string;
    slot: number;
    categories: number[];
}

export interface Category {
    id: number;
    name: string;
}

export interface State {
    slotMax: number[];
    slotCur: number[];
    categories: Category[];
    allSpells: Spell[];
    knownSpells: number[];
}
