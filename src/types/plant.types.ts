export interface PlantIdentification {
    id: string;
    plant_name: string;
    probability: number;
    confirmed: boolean;
    plant_details: {
        common_names: string[] | null;
        url: string;
        wiki_description: {
            value: string;
        } | null;
    };
}

export interface PlantIdApiResponse {
    suggestions: PlantIdentification[];
}