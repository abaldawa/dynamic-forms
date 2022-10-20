import {IntegrationServiceToOptions} from "../../../common/types/integration-service-types";
import {FormBuilderSchema} from "../../../../../client/components/FormBuilder/form-builder-schema";
import {FieldMapping, FieldMappingData} from "../../components/FieldMapping/FieldMapping";
import {userContactsDBFields} from "../../../../../common/types/user";

type HubspotFormData = Omit<IntegrationServiceToOptions['HubSpot'], "field_mappings">;
type InitialCustomFormData = Pick<IntegrationServiceToOptions['HubSpot'], "field_mappings">;

const hubspotFormSchema: FormBuilderSchema<
  HubspotFormData,
  FieldMappingData[],
  InitialCustomFormData,
  IntegrationServiceToOptions['HubSpot']
> = {
  title: "HubSpot",
  fields: [
    {
      name: "tenant_domain",
      label: "tenant_domain",
      type: "text",
      required: true
    },
    {
      name: "client_id",
      label: "client_id",
      type: "text",
      required: true
    },
    {
      name: "client_secret",
      label: "client_secret",
      type: "text",
      required: true
    }
  ],
  renderAdditionalCustomForm: (setAdditionalCustomFormData, initialFieldMappings) => {
    return <FieldMapping
      fields={userContactsDBFields}
      setMetaDataDetails={setAdditionalCustomFormData}
      initialFieldMappings={initialFieldMappings}
    />;
  },
  getInitialCustomFormData: (initialData) => {
    return initialData.field_mappings.map(fieldMapping => ({
      userField: fieldMapping.hubspotField,
      mappedField: fieldMapping.blinqContactField
    }));
  },
  getFormData: ({formData, customFormData: fieldMappings}) => {
    return {
      ...formData,
      field_mappings: fieldMappings.map((fieldMapping) => ({
        hubspotField: fieldMapping.userField,
        blinqContactField: fieldMapping.mappedField
      }))
    };
  }
};

export {
  hubspotFormSchema
};