import React, {Fragment, useEffect, useState} from "react";
import styles from "./FieldMapping.module.css";

interface FieldMappingData {
  userField: string;
  mappedField: string;
  error?: string
}

interface FieldMappingProps {
  fields: readonly string[];
  setMetaDataDetails: (completed: boolean, metaData?: FieldMappingData[]) => void;
  initialFieldMappings?: FieldMappingData[];
  children?: never;
}

const FieldMapping: React.FC<FieldMappingProps> = (props) => {
  const {
    fields,
    initialFieldMappings,
    setMetaDataDetails
  } = props;
  const [fieldMappings, setFieldMappings] = useState<FieldMappingData[]>( () => [{userField: "", mappedField: ""}]);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});

  const checkForErrorsInUserFieldMappingsAndUpdate = (
    newUserFieldMappings: FieldMappingData[]
  ) => {
    const userTextMapping = newUserFieldMappings.reduce((obj, fieldMapping) => {
      if(fieldMapping.userField) {
        obj[fieldMapping.userField] = (obj[fieldMapping.userField] ?? 0) + 1;
      }
      return obj;
    }, {} as Record<string, number>);

    setFieldMappings(
      newUserFieldMappings.map(
        (newUserFieldMapping) => {
          if(userTextMapping[newUserFieldMapping.userField] > 1) {
            newUserFieldMapping.error = 'Duplicate';
          } else {
            newUserFieldMapping.error = undefined;
          }

          return newUserFieldMapping;
        })
    );
  };

  const onFieldMappingDelete = (index: number, mappedField: string) => {
    const newUserFieldMappings = fieldMappings.filter((_, i) => i !== index);

    checkForErrorsInUserFieldMappingsAndUpdate(newUserFieldMappings);
    setSelectedFields((prevSelectedFields) => ({
      ...prevSelectedFields,
      [mappedField]: false
    }));
  };

  const onUserFieldChange = (index: number, userText: string) => {
    const newUserFieldMappings = fieldMappings.map((fieldMapping, i) => {
      const newFieldMapping: typeof fieldMapping = {...fieldMapping, error: undefined};

      if(index === i) {
        newFieldMapping.userField = userText;
      }

      return newFieldMapping;
    });

    checkForErrorsInUserFieldMappingsAndUpdate(newUserFieldMappings);
  };

  const onMappedFieldSelected = (index: number, mappedField: string) => {
    let previousMapField = '';

    setFieldMappings((previousMappings, ) =>
      previousMappings.map((previousMapping, i) => {
        if(index === i) {
          previousMapField = previousMapping.mappedField;
          return {...previousMapping, mappedField: mappedField};
        }

        return {...previousMapping};
      })
    );

    setSelectedFields((prevSelectedFields) => ({
      ...prevSelectedFields,
      [mappedField]: true,
      [previousMapField]: false
    }));
  };

  useEffect(() => {
    if(
      Object.keys(fieldMappings).length
      && fieldMappings.every(
        fieldMapping => !fieldMapping.error && fieldMapping.userField && fieldMapping.mappedField
      )
    ) {
      setMetaDataDetails(true, fieldMappings);
    } else {
      setMetaDataDetails(false);
    }
  }, [fieldMappings]);

  useEffect(() => {
    if(initialFieldMappings) {
      setFieldMappings([...initialFieldMappings]);

      setSelectedFields(
        initialFieldMappings.reduce((obj, {mappedField}) => {
          obj[mappedField] = true;
          return obj;
        }, {} as typeof selectedFields)
      );
    }
  }, [initialFieldMappings]);

  return (
    <div className={styles['container']}>
      <h4 className={styles['title']}>Field mappings</h4>
      <div className={styles['field-mapping-container']}>
        <span className={styles['field-mapping__label']}>Hubspot field</span>
        <span className={styles['field-mapping__label']}>Blinq contact field</span>
        <span></span>
        {fieldMappings.map((fieldMapping, index) => (
          <Fragment key={index}>
            <div className={styles['field-mapping__input']}>
              <input
                type="text"
                onChange={(e) => onUserFieldChange(index, e.target.value)}
                value={fieldMapping.userField}
              />
              {fieldMapping.error && (
                <span className={styles['field-mapping__input--error']}>{fieldMapping.error}</span>
              )}
            </div>
            <select
              className={styles['field-mapping__selection']}
              value={fieldMapping.mappedField}
              onChange={(e) => onMappedFieldSelected(index, e.target.value)}
            >
              <option value=""/>
              {fields
                .filter(field => fieldMapping.mappedField === field || !selectedFields[field])
                .map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
            </select>
            <button
              type="button"
              disabled={fieldMappings.length === 1}
              className={`
                ${styles['field-mapping__delete-button']}
                ${fieldMappings.length === 1 ? styles['field-mapping__delete-button--disabled'] : ''}
              `}
              onClick={() => onFieldMappingDelete(index, fieldMapping.mappedField)}
            >
              X
            </button>
          </Fragment>
        ))}
      </div>
      <button
        type="button"
        className={`
          ${styles['field-mapping__add-mapping']}
          ${fieldMappings.length === fields.length ? styles['field-mapping__add-mapping--disabled'] : ''}
        `}
        disabled={fieldMappings.length === fields.length}
        onClick={() => {setFieldMappings([...fieldMappings, {userField: "", mappedField: ""}])}}
      >
        Add mapping
      </button>
    </div>
  );
};

export type {
  FieldMappingData
};

export {
  FieldMapping
};