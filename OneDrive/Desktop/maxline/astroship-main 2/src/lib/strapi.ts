// Strapi API Configuration
const STRAPI_URL = import.meta.env.STRAPI_URL || import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN || import.meta.env.PUBLIC_STRAPI_TOKEN || '';

// Check if we're in production and environment variables are missing
if (import.meta.env.PROD && (!STRAPI_URL || STRAPI_URL === 'http://localhost:1337')) {
  console.warn('⚠️ Strapi URL not configured. Please set STRAPI_URL environment variable.');
}

if (import.meta.env.PROD && !STRAPI_TOKEN) {
  console.warn('⚠️ Strapi token not configured. Please set STRAPI_TOKEN environment variable.');
}

// Types
export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Puppy {
  id: number;
  name: string;
  status: 'Available' | 'Reserved';
  date_of_birth: string;
  price: number;
  gender: 'Male' | 'Female';
  color: string;
  weight: string;
  description: string;
  parents: string;
  healthrecords: string;
  images: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Stud {
  id: number;
  name: string;
  age: string;
  status: 'Available' | 'Busy' | 'Reserved';
  fee: number;
  description: string;
  bloodlines: string;
  specialties: string;
  images: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// API Service Class
class StrapiService {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string = STRAPI_URL, token: string = STRAPI_TOKEN) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Strapi API request failed:', error);
      throw error;
    }
  }

  // Puppy operations
  async getPuppies(options: {
    page?: number;
    pageSize?: number;
    populate?: string;
    filters?: Record<string, any>;
    sort?: string;
  } = {}): Promise<StrapiResponse<Puppy[]>> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('pagination[page]', options.page.toString());
    if (options.pageSize) params.append('pagination[pageSize]', options.pageSize.toString());
    if (options.populate) params.append('populate', options.populate);
    if (options.sort) params.append('sort', options.sort);
    
    // Handle filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(`filters[${key}][$eq]`, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/puppies${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Puppy[]>(endpoint);
  }

  async getPuppy(id: number, populate: string = '*'): Promise<StrapiResponse<Puppy>> {
    return this.request<Puppy>(`/puppies/${id}?populate=${populate}`);
  }

  async getAvailablePuppies(): Promise<StrapiResponse<Puppy[]>> {
    return this.getPuppies({
      filters: { status: 'Available' },
      populate: 'images',
      sort: 'createdAt:desc',
    });
  }

  // Stud operations
  async getStuds(options: {
    page?: number;
    pageSize?: number;
    populate?: string;
    filters?: Record<string, any>;
    sort?: string;
  } = {}): Promise<StrapiResponse<Stud[]>> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('pagination[page]', options.page.toString());
    if (options.pageSize) params.append('pagination[pageSize]', options.pageSize.toString());
    if (options.populate) params.append('populate', options.populate);
    if (options.sort) params.append('sort', options.sort);
    
    // Handle filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(`filters[${key}][$eq]`, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/studs${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Stud[]>(endpoint);
  }

  async getStud(id: number, populate: string = '*'): Promise<StrapiResponse<Stud>> {
    return this.request<Stud>(`/studs/${id}?populate=${populate}`);
  }

  async getAvailableStuds(): Promise<StrapiResponse<Stud[]>> {
    return this.getStuds({
      filters: { status: 'Available' },
      populate: 'images',
      sort: 'createdAt:desc',
    });
  }

  // Utility methods
  getImageUrl(image: StrapiImage, size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
    if (image.formats && image.formats[size]) {
      return `${this.baseURL}${image.formats[size]!.url}`;
    }
    return `${this.baseURL}${image.url}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

// Create and export singleton instance
export const strapiService = new StrapiService();

// Export individual functions for convenience
export const getPuppies = (options?: Parameters<typeof strapiService.getPuppies>[0]) => 
  strapiService.getPuppies(options);
export const getPuppy = (id: number, populate?: string) => 
  strapiService.getPuppy(id, populate);
export const getAvailablePuppies = () => 
  strapiService.getAvailablePuppies();
export const getStuds = (options?: Parameters<typeof strapiService.getStuds>[0]) => 
  strapiService.getStuds(options);
export const getStud = (id: number, populate?: string) => 
  strapiService.getStud(id, populate);
export const getAvailableStuds = () => 
  strapiService.getAvailableStuds();
export const getImageUrl = (image: StrapiImage, size?: 'thumbnail' | 'small' | 'medium' | 'large') => 
  strapiService.getImageUrl(image, size);
export const formatPrice = (price: number) => 
  strapiService.formatPrice(price);
export const formatDate = (dateString: string) => 
  strapiService.formatDate(dateString);

export default strapiService; 