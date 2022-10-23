import { z } from "zod";

const SalesforceIntegrationSchema = z.object({
  client_id: z.string().min(1),
  client_secret: z.string().min(1)
}).strict();

type SalesforceIntegration = z.infer<typeof SalesforceIntegrationSchema>;

export type {
  SalesforceIntegration
};

export {
  SalesforceIntegrationSchema
};