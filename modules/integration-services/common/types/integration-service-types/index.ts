import {SalesforceIntegration, SalesforceIntegrationSchema} from "./salesforce";
import {ZapierIntegration, ZapierIntegrationSchema} from "./zapier";
import {HubspotIntegration, HubspotIntegrationSchema} from "./hubspot";

const IntegrationServiceToOptionsSchema = {
  Salesforce: SalesforceIntegrationSchema,
  Zapier: ZapierIntegrationSchema,
  HubSpot: HubspotIntegrationSchema
} as const;

interface IntegrationServiceToOptions {
  Salesforce: SalesforceIntegration;
  Zapier: ZapierIntegration;
  HubSpot: HubspotIntegration;
}

type SupportedIntegrationServices = keyof IntegrationServiceToOptions;

export type {
  IntegrationServiceToOptions,
  SupportedIntegrationServices
};

export {
  IntegrationServiceToOptionsSchema
};