export interface Estate {
    id: number | undefined;
    userId: string | undefined;
    name: string;
    city: string;
    region: string;
    country: string;
    streetName: string;
    streetNumber: string;
    flatNumber: string;
    createdOn: Date | undefined;
    photo: string | undefined;
  }