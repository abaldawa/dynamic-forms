import React, {useEffect, useState} from "react";
import {User} from "../../../../../common/types/user";
import {UserIntegration} from "../../../../../common/types/user-integration";
import {FormBuilder} from "../../../../../client/components/FormBuilder/FormBuilder";
import {integrationServiceToFormSchema} from "../../constants/integrations-form-schema-definition";
import {FormBuilderSchema} from "../../../../../client/components/FormBuilder/form-builder-schema";
import {
  IntegrationServiceToOptions,
  SupportedIntegrationServices
} from "../../../common/types/integration-service-types";
import styles from "./ManageIntegrations.module.css";

interface ManageIntegrationsProps {
  userId: User['id'];
  configuredIntegrations: UserIntegration[];
  updateConfiguredIntegration: (
    integrationId: string,
    integrationServiceName: SupportedIntegrationServices,
    updatedIntegrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
  ) => void;
  deleteConfiguredIntegration: (integrationToDelete: UserIntegration) => void;
}

const ManageIntegrations: React.FC<ManageIntegrationsProps> = (props) => {
  const {
    userId,
    configuredIntegrations,
    updateConfiguredIntegration,
    deleteConfiguredIntegration
  } = props;

  const [selectedIntegrationConfig, setSelectedIntegrationConfig] = useState<UserIntegration>();

  useEffect(() => {
    if(selectedIntegrationConfig) {
      const newSelectedIntegrationConfig = configuredIntegrations.find(
        configuredIntegration => configuredIntegration.id === selectedIntegrationConfig.id
      );

      setSelectedIntegrationConfig(newSelectedIntegrationConfig);
    }
  }, [configuredIntegrations]);

  return (
    <section className={styles.container}>
      <article className={styles['configured-integrations-container']}>
        <h3>Configured integrations</h3>
        {Boolean(configuredIntegrations.length) ? (
          <>
            <span>(Click for more details)</span>
            {configuredIntegrations.map(configuredIntegration => {
              return (
                <div
                  className={`
                  ${styles['configured-integrations__list']}
                  ${selectedIntegrationConfig?.id === configuredIntegration.id ? styles['configured-integrations__list--active'] : ''}
                `}
                  onClick={() => setSelectedIntegrationConfig(configuredIntegration)}
                  key={configuredIntegration.id}
                >
                  {configuredIntegration.integrationServiceName}
                </div>
              );
            })}
          </>
        ): (
          <span>No integration configured</span>
        )}
      </article>
      {selectedIntegrationConfig && (
        <article className={styles['edit-configuration-container']}>
          <span className={styles['edit-configuration-container__title']}>Update Integration configuration</span>
          <FormBuilder
            formSubmitButtonLabel="Update"
            formDeleteButtonLabel="Delete"
            schema={integrationServiceToFormSchema[selectedIntegrationConfig.integrationServiceName] as FormBuilderSchema}
            initialFormData={selectedIntegrationConfig.integrationServiceData}
            onFormDelete={() => deleteConfiguredIntegration(selectedIntegrationConfig)}
            onFormSubmit={(data: IntegrationServiceToOptions[SupportedIntegrationServices]) => updateConfiguredIntegration(
              selectedIntegrationConfig.id,
              selectedIntegrationConfig.integrationServiceName,
              data
            )}
          />
        </article>
      )}
    </section>
  );
};

export {
  ManageIntegrations
};