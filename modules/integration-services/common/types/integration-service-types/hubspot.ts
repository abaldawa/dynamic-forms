import { z } from "zod";
import {contactsDbFields} from "../../../../../common/types/user";

const HubspotIntegrationSchema = z.object({
  tenant_domain: z.string().min(1),
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
  field_mappings: z.object({
    hubspotField: z.string().min(1),
    blinqContactField: z.enum(contactsDbFields)
  }).strict().array().min(1)
}).strict();

type HubspotIntegration = z.infer<typeof HubspotIntegrationSchema>;

export type {
  HubspotIntegration
};

export {
  HubspotIntegrationSchema
};