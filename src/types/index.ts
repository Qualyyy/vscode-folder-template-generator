export interface Structure {
    name: string;
    variables?: Variable[];
    optionals?: string[];
    structure: StructureItem[];
}

export interface Variable {
    varName: string;
    default?: string;
}

export interface StructureItem {
    fileName: string;
    template?: string;
    optional?: string;
}