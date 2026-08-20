import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    h1: z.string().optional(),
    category: z.enum(['common-rail', 'gasoline', 'tnvd', 'brands', 'diagnostics', 'commercial']),
    icon: z.string().default('Wrench'),
    image: z.string(),
    featured: z.boolean().default(false),
    priceFrom: z.string(),
    executionTime: z.string(),
    relatedServices: z.array(z.string()).default([]),
  }),
});

export const collections = {
  services: servicesCollection,
};
