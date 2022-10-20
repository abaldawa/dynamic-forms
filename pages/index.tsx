import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import {SetupIntegration} from "../modules/integration-services/client/containers/SetupIntegration/SetupIntegration";
import {
  IntegrationServiceToOptions,
  SupportedIntegrationServices
} from "../modules/integration-services/common/types/integration-service-types";
import {UserIntegration} from "../common/types/user-integration";
import {useEffect, useMemo, useState} from "react";
import {
  ManageIntegrations
} from "../modules/integration-services/client/containers/ManageIntegrations/ManageIntegrations";
import {database} from "../server/database";
import {User} from "../common/types/user";
import * as integrationServicesClient from "../modules/integration-services/client/service";
import styles from "../styles/Home.module.css";

const getNonConfiguredIntegrationNames = (
  supportedIntegrations: SupportedIntegrationServices[],
  configuredUserIntegrations: UserIntegration[]
) => supportedIntegrations.filter(supportedIntegration => {
  return !configuredUserIntegrations.find(configuredUserIntegration => configuredUserIntegration.integrationServiceName === supportedIntegration);
});

interface HomeProps {
  userId: User['id'];
  supportedIntegrationNames: SupportedIntegrationServices[];
}

const Home: NextPage<HomeProps> = (props) => {
  const {
    userId,
    supportedIntegrationNames
  } = props;
  const [configuredUserIntegrations, setConfiguredUserIntegrations] = useState<UserIntegration[]>([]);
  const [operationStatus, setOperationStatus] = useState<{status: 'info' | 'error' | 'success',message: string}>();

  const nonConfiguredIntegrationNames = useMemo(() => {
    return getNonConfiguredIntegrationNames(supportedIntegrationNames, configuredUserIntegrations);
  }, [supportedIntegrationNames, configuredUserIntegrations]);

  const fetchConfiguredIntegrations = async () => {
    const configuredIntegrations = await integrationServicesClient.fetchConfiguredIntegrations(userId);
    setConfiguredUserIntegrations(configuredIntegrations);
  };

  const createIntegration = async (
    integrationServiceName: SupportedIntegrationServices,
    integrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
  ) => {
    try {
      const createdIntegration = await integrationServicesClient.createIntegration(userId, integrationServiceName, integrationServiceData);

      setConfiguredUserIntegrations(createdIntegration);
      setOperationStatus({
        status: 'success',
        message: `Successfully integrated with '${integrationServiceName}'`
      });
    } catch(err: unknown) {
      setOperationStatus({
        status: 'error',
        message: `Operation failed: ${err}`
      });
    }
  };

  const updateConfiguredIntegration = async (
    integrationId: string,
    integrationServiceName: SupportedIntegrationServices,
    updatedIntegrationServiceData: IntegrationServiceToOptions[SupportedIntegrationServices]
  ) => {
    try {
      const updatedIntegration = await integrationServicesClient.updateConfiguredIntegration(
        userId,
        integrationId,
        integrationServiceName,
        updatedIntegrationServiceData
      );

      await fetchConfiguredIntegrations();
      setOperationStatus({
        status: 'success',
        message:`'${updatedIntegration.integrationServiceName}' integration configuration updated`
      });
    } catch(err: unknown) {
      setOperationStatus({
        status: 'error',
        message: `Operation failed: ${
          err
        }. Next.js dev server may have restarted and cleared the in-memory DB. Please reload the page and try again`
      });
    }
  };

  const deleteConfiguredIntegration = async (
    integrationToDelete: UserIntegration
  ) => {
    try {
      const deletedIntegration = await integrationServicesClient.deleteConfiguredIntegration(userId, integrationToDelete);

      await fetchConfiguredIntegrations();
      setOperationStatus({
        status: 'success',
        message:`Successfully disconnected from '${deletedIntegration.integrationServiceName}' integration`
      });
    } catch(err: unknown) {
      setOperationStatus({
        status: 'error',
        message: `Operation failed: ${
          err
        }. Next.js dev server may have restarted and cleared the in-memory DB. Please reload the page and try again`
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchConfiguredIntegrations();
      } catch(err: unknown) {
        setOperationStatus({
          status: 'error',
          message: `Operation failed: ${err}`
        });
      }
    })();
  }, []);

  useEffect(() => {
    if(operationStatus) {
      const timeoutId = setTimeout(() => {
        setOperationStatus(undefined);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [operationStatus]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Blinq • Integrations</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles['integration-settings-container']}>
        <h3 className={styles.title}>Integration settings</h3>
        {operationStatus && (
          <span
            className={`
              ${
                operationStatus.status === 'success'
                  ? styles['success-message']
                  : operationStatus.status === 'error'
                    ? styles['error-message']
                    : styles['info-message']
              }
            `}
          >
            {operationStatus.message}
          </span>
        )}
        <ManageIntegrations
          userId={userId}
          updateConfiguredIntegration={updateConfiguredIntegration}
          configuredIntegrations={configuredUserIntegrations}
          deleteConfiguredIntegration={deleteConfiguredIntegration}
        />
        <SetupIntegration
          availableIntegrationServiceNames={nonConfiguredIntegrationNames}
          createIntegration={createIntegration}
        />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const supportedIntegrationNames = database.integrations.getSupportedIntegrationServiceNames();
  const userId = database.users.getUser().id;

  return {
    props: {
      userId,
      supportedIntegrationNames
    }
  };
};

export default Home;
