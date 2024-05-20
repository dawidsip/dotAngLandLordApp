import { Image } from "./image";
// export interface Estate {
//     id: number | undefined;
//     userId: string | undefined;
//     name: string;
//     city: string;
//     region: string;
//     country: string;
//     streetName: string;
//     streetNumber: string;
//     flatNumber: string;
//     createdOn: Date | undefined;
//     images: Image[] | undefined;
//   }

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
}