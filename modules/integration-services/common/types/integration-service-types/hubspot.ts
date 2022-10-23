import { z } from "zod";
import {contactsDbFields} from "../../../../../common/types/user";

const HubspotIntegrationSchema = z.object({
  tenant_domain: z.string().min(1),
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
  field_mappings: z
    .object({
      hubspotField: z.string().min(1),
      blinqContactField: z.enum(contactsDbFields)
    })
    .strict()
    .array()
    .min(1)
    .superRefine((field_mappings, context) => {
      /**
       * Basically this method checks whether field_mappings has
       * any duplicate values in ANY user typed hubspotField and, it
       * also checks whether there are any duplicate values
       * in any blinqContactField.
       *
       * The mapping should be one on one and unique.
       */

      // 1. Prepare datastructure to identify and record duplicate values
      const hubspotFieldMap: Record<string, true> = {};
      const duplicateHubspotFieldMap: Record<string, true> = {};

      const blinqContactFieldMap: Record<string, true> = {};
      const duplicateBlinqFieldMap: Record<string, true> = {};

      field_mappings.forEach(field_mapping => {
        const {hubspotField, blinqContactField} = field_mapping;

        if(hubspotFieldMap[hubspotField]) {
          duplicateHubspotFieldMap[hubspotField] = true;
        } else {
          hubspotFieldMap[hubspotField] = true;
        }

        if(blinqContactFieldMap[blinqContactField]) {
          duplicateBlinqFieldMap[blinqContactField] = true;
        } else {
          blinqContactFieldMap[blinqContactField] = true;
        }
      });

      // 2. If duplicate values are found then identify its exact location in the field_mappings array and respond with error
      if(Object.keys(duplicateHubspotFieldMap).length || Object.keys(duplicateBlinqFieldMap).length) {
        field_mappings.forEach((field_mapping, index) => {
          const {hubspotField, blinqContactField} = field_mapping;

          if(duplicateHubspotFieldMap[hubspotField]) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: [index, "hubspotField"],
              message: `Value '${hubspotField}' appears more than once. Duplicate not allowed`
            });
          }

          if(duplicateBlinqFieldMap[blinqContactField]) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: [index, "blinqContactField"],
              message: `Value '${blinqContactField}' appears more than once. Duplicate value not allowed`
            });
          }
        });
      }
    })
}).strict();

type HubspotIntegration = z.infer<typeof HubspotIntegrationSchema>;

export type {
  HubspotIntegration
};

export {
  HubspotIntegrationSchema
};