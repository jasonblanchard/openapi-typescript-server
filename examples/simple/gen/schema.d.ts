/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/pets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/pet/{petId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPetById"];
        put?: never;
        post: operations["updatePetWithForm"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ErrorResponse: {
            message?: string;
        };
        Pet: {
            /** Format: int64 */
            id: number;
            name: string;
            category?: components["schemas"]["Category"];
            photoUrls?: string[];
            tags?: components["schemas"]["Tag"][];
            /**
             * @description pet status in the store
             * @enum {string}
             */
            status?: "available" | "pending" | "sold";
        };
        Category: {
            /** Format: int64 */
            id?: number;
            name?: string;
        };
        Tag: {
            /** Format: int64 */
            id?: number;
            name?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listPets: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A list of pets. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        pets?: components["schemas"]["Pet"][];
                    };
                };
            };
            /** @description unexpected error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getPetById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of pet to return */
                petId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        pet?: components["schemas"]["Pet"];
                    };
                };
            };
            /** @description unexpected error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    updatePetWithForm: {
        parameters: {
            query?: {
                /** @description Name of pet that needs to be updated */
                name?: string;
            };
            header?: never;
            path: {
                /** @description ID of pet that needs to be updated */
                petId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    status: "available" | "pending" | "sold";
                };
            };
        };
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        pet?: components["schemas"]["Pet"];
                    };
                };
            };
            /** @description unexpected error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
}
