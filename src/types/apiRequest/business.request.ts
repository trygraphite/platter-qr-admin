// Update Business (PATCH)
export interface UpdateBusinessRequest {
  name: string;
  description: string;
  subdomain: string;
  website: string;
  socials: string[];
  address: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    proofOfAddress: string;
    latitude: string;
    longitude: string;
  };
  logo: string;
  image: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  hours: Array<{
    day: string; // e.g., 'monday'
    opening: string; // e.g., '08:00'
    closing: string; // e.g., '17:00'
  }>;
}

// Create Business Table (POST)
export interface CreateBusinessTableRequest {
  name: string;
}

// Create/Update Service Point (POST/PATCH)
export interface ServicePointRequest {
  name: string;
  description: string;
}
