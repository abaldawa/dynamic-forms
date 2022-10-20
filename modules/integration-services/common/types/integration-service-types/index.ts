import {SalesforceIntegration} from "./salesforce";
import {ZapierIntegration} from "./zapier";
import {HubspotIntegration} from "./hubspot";

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