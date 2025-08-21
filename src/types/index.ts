export interface Structure {
    name: string;
    variables?: Variable[];
    optionals?: Optional[];
    structure: StructureItem[];
}

export interface Variable {
    varName: string;
    default?: string;
}

export interface Optional {
    optName: string;
    value?: boolean;
}

export interface StructureItem {
    fileName: string;
    template?: string;
    optional?: string;
}