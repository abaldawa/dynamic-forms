import {HTMLInputTypeAttribute} from "react";

interface FormInput<FormData extends Record<string, string> = Record<string, string>> {
  name: keyof FormData;
  type: Extract<HTMLInputTypeAttribute, 'text'>;
  label: string;
  required?: boolean;
}

interface FormBuilderSchema<
  FormData extends Record<string, string> = Record<string, string>,
  AdditionalCustomFormData = unknown,
  InitialCustomFormData = unknown,
  FormBuilderResponse = unknown
> {
  title: string;
  fields: FormInput<FormData>[];
  renderAdditionalCustomForm?: (
    setAdditionalCustomFormData: (completed: boolean, additionalFormData?: AdditionalCustomFormData) => void,
    initialCustomFormData?: AdditionalCustomFormData
  ) => JSX.Element;
  getInitialCustomFormData?: (initialData: InitialCustomFormData) => AdditionalCustomFormData;
  getFormData: (
    data: {formData: FormData; customFormData: AdditionalCustomFormData}
  ) => FormBuilderResponse;
}

export type {
  FormInput,
  FormBuilderSchema
};