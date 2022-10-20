import React, {FormEvent, Fragment, useEffect, useMemo, useState} from "react";
import {FormInput, FormBuilderSchema} from "./form-builder-schema";
import styles from "./FormBuilder.module.css";

interface FormBuilderProps<FormBuilderData> {
  schema: FormBuilderSchema;
  onFormSubmit: (data: FormBuilderData) => void;
  formSubmitButtonLabel?: string;
  formDeleteButtonLabel?: string;
  onFormDelete?: () => void;
  initialFormData?: Record<string, unknown>;
  children?: never;
}

const FormBuilder= <FormBuilderData,>(props: FormBuilderProps<FormBuilderData>) => {
  const {
    schema,
    initialFormData,
    onFormSubmit,
    formDeleteButtonLabel,
    formSubmitButtonLabel = "Submit",
    onFormDelete
  } = props;
  const {title: formTitle, fields, renderAdditionalCustomForm, getFormData, getInitialCustomFormData} = schema;

  const [
    formData,
    setFormData
  ] = useState<Record<string, {value: string; error?: string}>>({});
  const [customFormCompleted, setCustomFormCompleted] = useState(!renderAdditionalCustomForm);
  const [customFormData, setCustomFormData] = useState<unknown>();

  const formCompleted = useMemo(() => {
    return fields.every(field => field.required ? Boolean(formData[field.name]?.value) : true)
  }, [formData, fields]);

  const initialCustomFormData = useMemo(() => {
    if(initialFormData && getInitialCustomFormData) {
      const fieldsToExclude = fields.reduce((keysToExclude, formField) => {
        keysToExclude[formField.name] = true;
        return keysToExclude;
      }, {} as Record<string, true>);

      const customFormDataObj = Object.fromEntries(
        Object.entries(initialFormData)
          .filter(([key]) => !fieldsToExclude[key])
      );

      return getInitialCustomFormData(customFormDataObj);
    }
  }, [fields, initialFormData]);

  const setAdditionalCustomFormData = (completed: boolean, additionalFormData?: unknown) => {
    setCustomFormCompleted(completed);
    setCustomFormData(additionalFormData);
  };

  const onFormSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onFormSubmit( getFormData({
      formData: Object.fromEntries(
        Object.entries(formData).map(([key, valueObj]) => [key, valueObj.value])
      ),
      customFormData
    }) as FormBuilderData);
    setFormData({});
  };

  const onInputChange = (newValue: string, formInput: FormInput) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [formInput.name]: {
        value: newValue,
        error: formInput.required ? (newValue ? undefined : "Required") : undefined
      }
    }));
  };

  useEffect(() => {
    const initialFormDataState: typeof formData = {};

    if(initialFormData) {
      for(const formField of fields) {
        const initialFormFieldValue = initialFormData[formField.name];

        if(typeof initialFormFieldValue === 'string') {
          initialFormDataState[formField.name] = {
            value: initialFormFieldValue,
          };
        }
      }
    }

    setFormData(initialFormDataState);
    setCustomFormCompleted(!schema.renderAdditionalCustomForm);
    setCustomFormData(undefined);
  }, [schema, initialFormData]);

  return (
    <form className={styles['form-container']} onSubmit={onFormSubmitHandler}>
      <h2 className={styles['form-title']}>{formTitle}</h2>
      <div className={styles['form-fields-container']}>
        {fields.map(field => {
          return (
            <Fragment key={field.name}>
              <span className={styles['form-fields__label']}>{field.label}</span>
              <div className={styles['form-fields__input']}>
                <input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name]?.value ?? ''}
                  onChange={(e) => onInputChange(e.target.value, field)}
                />
                {formData[field.name]?.error && (
                  <span className={styles['form-fields__input--error']}>
                    {formData[field.name].error}
                  </span>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
      {renderAdditionalCustomForm?.(setAdditionalCustomFormData, initialCustomFormData)}
      <div className={styles['form-button-wrapper']}>
        <button
          type="submit"
          className={`
          ${styles['form-button']}
          ${!customFormCompleted || !formCompleted ? styles['form-submit--disabled'] : ''}
        `}
          disabled={!customFormCompleted || !formCompleted}
        >
          {formSubmitButtonLabel}
        </button>
        {formDeleteButtonLabel && onFormDelete && (
          <button
            type="button"
            className={`
              ${styles['form-button']}
            `}
            onClick={onFormDelete}
          >
            {formDeleteButtonLabel}
          </button>
        )}
      </div>
    </form>
  );
};

export {
  FormBuilder
};