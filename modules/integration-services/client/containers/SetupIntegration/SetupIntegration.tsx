import React, {useEffect, useState} from "react";
import {
  IntegrationServiceToOptions,
  SupportedIntegrationServices
} from "../../../common/types/integration-service-types";
import {FormBuilderSchema} from "../../../../../client/components/FormBuilder/form-builder-schema";
import {FormBuilder} from "../../../../../client/components/FormBuilder/FormBuilder";
import {integrationServiceToFormSchema} from "../../constants/integrations-form-schema-definition";
import styles from './SetupIntegration.module.css';

interface SetupIntegrationProps {
  availableIntegrationServiceNames: SupportedIntegrationServices[];
  createIntegration: (
    selectedIntegration: SupportedIntegrationServices,
    integrationData: IntegrationServiceToOptions[SupportedIntegrationServices]
  ) => void;
}

const SetupIntegration: React.FC<SetupIntegrationProps> = (props) => {
  const {availableIntegrationServiceNames, createIntegration} = props;
  const [selectedIntegration, setSelectedIntegration] = useState<SupportedIntegrationServices | "">("");

  useEffect(() => {
    setSelectedIntegration("");
  }, [availableIntegrationServiceNames]);

  return (
    <section className={styles['container']}>
      <h2 className={styles['title']}>Setup an Integration</h2>
      {Boolean(availableIntegrationServiceNames.length) ? (
        <>
          <label>
            <span className={styles['selection-label']}>Select an integration</span>
            <select
              value={selectedIntegration}
              onChange={(e) => setSelectedIntegration(e.target.value as typeof selectedIntegration)}
            >
              <option value=""/>
              {availableIntegrationServiceNames.map(availableIntegrationServiceName => (
                <option key={availableIntegrationServiceName}>{availableIntegrationServiceName}</option>
              ))}
            </select>
          </label>
          {!!selectedIntegration && (
            <FormBuilder
              schema={integrationServiceToFormSchema[selectedIntegration] as FormBuilderSchema}
              onFormSubmit={(data: IntegrationServiceToOptions[SupportedIntegrationServices]) => createIntegration(selectedIntegration, data)}
            />
          )}
        </>
      ): (
        <span>No more integrations to add</span>
      )}
    </section>
  );
};

export {
  SetupIntegration
};