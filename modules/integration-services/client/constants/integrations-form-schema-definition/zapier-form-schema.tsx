import {IntegrationServiceToOptions} from "../../../common/types/integration-service-types";
import {FormBuilderSchema} from "../../../../../client/components/FormBuilder/form-builder-schema";

const zapierFormSchema: FormBuilderSchema<
  IntegrationServiceToOptions['Zapier'],
  never,
  never,
  IntegrationServiceToOptions['Zapier']
> = {
  title: "Zapier",
  fields: [
    {
      type: 'text',
      name: 'api_key',
      label: 'api_key',
      required: true
    }
  ],
  getFormData: ({formData}) => formData
};

export {
  zapierFormSchema
};