export interface Project {
  id: string;
  title: string;
  category: 'Contabilidad' | 'Automatización' | 'Desarrollo' | 'Análisis';
  description: string;
  technologies: string[];
  imageUrl: string;
  link?: string;
  actionType?: 'corporate_web' | 'tax_calendar' | 'external';
}

export interface CorporatePage {
  id: string;
  title: string;
  client: string;
  category: string;
  url: string;
  description: string;
  status: 'Publicado' | 'En Desarrollo' | 'Demo Interactivo';
  technologies: string[];
  imageUrl: string;
  createdAt: string;
}

export interface TaxDeadline {
  id: string;
  organism: 'AFIP' | 'AGIP' | 'ARBA' | 'Convenio Multilateral';
  taxName: string;
  cuitEnding: string;
  dueDate: string;
  status: 'Próximo' | 'Urgente' | 'Presentado';
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface SkillData {
  subject: string;
  A: number; // Skill level
  fullMark: number;
}

