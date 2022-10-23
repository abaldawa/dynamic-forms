import { z } from "zod";

const ZapierIntegrationSchema = z.object({
  api_key: z.string().min(1)
}).strict();

type ZapierIntegration = z.infer<typeof ZapierIntegrationSchema>;

export type {
  ZapierIntegration
};

export {
  ZapierIntegrationSchema
};