/* Defines the product entity */
export interface ITemplate {
    id: string;
    name: string;
    creationDate: string;
    variables: Array<string>;
}