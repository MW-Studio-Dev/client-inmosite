// types/landing.ts
export interface Plan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
    cta: string;
  }
  
  export interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
  
  export interface Testimonial {
    name: string;
    company: string;
    avatar: string;
    rating: number;
    text: string;
  }
  
  export interface Stat {
    number: string;
    label: string;
  }
  
  export interface ContactForm {
    name: string;
    email: string;
    company: string;
    message: string;
  }
  
  export interface Step {
    step: string;
    title: string;
    description: string;
  }
  
  export type SubmitStatus = 'success' | 'error' | null;