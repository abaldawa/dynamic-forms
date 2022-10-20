import {hubspotFormSchema} from "./hubspot-form-schema";
import {salesforceFormSchema} from "./salesforce-form-schema";
import {zapierFormSchema} from "./zapier-form-schema";

const integrationServiceToFormSchema = {
  HubSpot: hubspotFormSchema,
  Salesforce: salesforceFormSchema,
  Zapier: zapierFormSchema
};

export {
  integrationServiceToFormSchema
};