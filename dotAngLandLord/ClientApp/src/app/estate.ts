import { Image } from "./image";
import { Facility } from "./facility";

  export interface Estate {
    id: number;
    userId: string;
    name: string;
    city: string;
    region: string;
    country: string;
    streetName: string;
    streetNumber: string;
    flatNumber?: string;
    createdOn: Date;
    images: Image[];
    facilities: Facility[];
}