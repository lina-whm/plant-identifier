export interface PlantDetails {
    similar_images?: Array<{
        id: string;
        url: string;
    }>;
}

export interface PlantIdentification {
    id: string;
    name: string;
    plant_name?: string;
    probability: number;
    confirmed?: boolean;
    details: PlantDetails;
}

export type PlantIdApiResponse = any;