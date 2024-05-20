export interface Image {
    id: number | undefined;
    estateId: number | undefined;
    fileName: string;
    isMain: boolean;
    data: ArrayBuffer | undefined;
}
