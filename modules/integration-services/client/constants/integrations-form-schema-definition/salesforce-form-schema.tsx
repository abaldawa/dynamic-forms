import {IntegrationServiceToOptions} from "../../../common/types/integration-service-types";
import {FormBuilderSchema} from "../../../../../client/components/FormBuilder/form-builder-schema";

const salesforceFormSchema: FormBuilderSchema<
  IntegrationServiceToOptions['Salesforce'],
  never,
  never,
  IntegrationServiceToOptions['Salesforce']
> = {
  title: "Salesforce",
  fields: [
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
  getFormData: ({formData}) => formData
};

export {
  salesforceFormSchema
};