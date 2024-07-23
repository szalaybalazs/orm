export interface iDependency {
    table: string;
    columns: string[];
}
export interface iCustomType {
    name: string;
    type: 'ENUM';
    values: string[];
    dependencies: iDependency[];
}
