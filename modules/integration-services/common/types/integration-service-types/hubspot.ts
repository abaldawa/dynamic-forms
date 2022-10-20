type HubspotIntegration = {
  tenant_domain: string;
  client_id: string;
  client_secret: string;
  field_mappings: Array<{
    hubspotField: string;
    blinqContactField: string;
  }>;
}

export type {
  HubspotIntegration
}