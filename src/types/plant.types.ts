export interface SimilarImage {
    id: string;
    url: string;
}

export interface PlantDetails {
    common_names?: string[];
    similar_images?: SimilarImage[];
    description?: string;
    url?: string;
    latin_name?: string;
}

export interface PlantSuggestion {
    id: string;
    name: string;
    probability: number;
    confirmed: boolean;
    details: PlantDetails;
}

// один простой тип для данных API (вместо двух)
export interface PlantIdApiData {
    suggestions: PlantSuggestion[];
    result?: any;
    [key: string]: any;
}

export interface PlantIdApiSuccessResponse {
    success: true;
    data: PlantIdApiData;
    timestamp: string;
    isMock?: boolean;
    source?: string;
}

export interface PlantIdApiErrorResponse {
    success: false;
    error: string;
    timestamp: string;
    isMock?: boolean;
}

export type PlantIdApiResponse = 
    | PlantIdApiSuccessResponse 
    | PlantIdApiErrorResponse;

export interface PlantIdentification extends PlantSuggestion {
    probabilityPercent: number;
    isMock?: boolean;
}

// хелпер для TypeScript
export function isSuccessResponse(
    response: PlantIdApiResponse
): response is PlantIdApiSuccessResponse {
    return response.success === true;
}