import {
   AppFieldTypes,
   Routes,
   PagerDutyIcon,
   CreateIncidentForm,
   CreateIncidentFormModalType,
   CreateIncidentFormCommandType,
   ExceptionType,
   AppExpandLevels
} from "../constant";
import {AppCallRequest, AppContext, AppField, AppForm, AppSelectOption, Oauth2App} from "../types";
import { getServiceOptionList, getUsersOptionList } from "./pagerduty-options";
import { PagerDutyOpts, PostIncident } from "../types/pagerduty";
import { tryPromiseForGenerateMessage, tryPromisePagerdutyWithMessage } from "../utils/utils";
import { api, PartialCall } from "@pagerduty/pdjs/build/src/api";
import { configureI18n } from "../utils/translations";

export async function createIncidentFormModal(call: AppCallRequest): Promise<AppForm> {
   const oauth2: Oauth2App | undefined = call.context.oauth2;
   const tokenOpts: PagerDutyOpts = { token: <string>oauth2.user?.token, tokenType: 'bearer' };
	 const i18nObj = configureI18n(call.context);
   
   const serviceOpts: AppSelectOption[] = await getServiceOptionList(tokenOpts, call.context);
   const assignToOpts: AppSelectOption[] = await getUsersOptionList(tokenOpts, call.context);

   const fields: AppField[] = [
      {
         type: AppFieldTypes.STATIC_SELECT,
         options: serviceOpts,
         name: CreateIncidentForm.SERVICE,
         modal_label: i18nObj.__('forms.incident-create.impacted-label'),
         description: i18nObj.__('forms.incident-create.impacted-description'),
         is_required: true,
      },
      {
         type: AppFieldTypes.TEXT,
         name: CreateIncidentForm.TITLE,
         modal_label: i18nObj.__('forms.incident-create.title-label'),
         description: i18nObj.__('forms.incident-create.title-description'),
         is_required: true
      },
      {
         type: AppFieldTypes.TEXT,
         name: CreateIncidentForm.DESCRIPTION,
         modal_label: i18nObj.__('forms.incident-create.description-label'),
         description: i18nObj.__('forms.incident-create.description-description'),
         is_required: false
      },
      {
         type: AppFieldTypes.STATIC_SELECT,
         options: assignToOpts,
         name: CreateIncidentForm.ASSIGN_TO,
         modal_label: i18nObj.__('forms.incident-create.assign-label'),
         description: i18nObj.__('forms.incident-create.assign-description'),
         is_required: false,
      },
   ];

   return {
      title: i18nObj.__('forms.incident-create.title'),
      icon: PagerDutyIcon,
      fields: fields,
      submit: {
         path: `${Routes.App.CallPathForms}${Routes.App.CallPathIncidentCreate}${Routes.App.CallPathSubmit}`,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      }
   } as AppForm;
}

export async function addIncidentFromCommand(call: AppCallRequest) {
   const values = call.values as CreateIncidentFormCommandType;
	 const i18nObj = configureI18n(call.context);

   if (!values?.incident_impacted_service && !values?.incident_title) {
      throw new Error(i18nObj.__('forms.incident-create.add-incident-exception'));
   }

   const oauth2: Oauth2App | undefined = call?.context?.oauth2;
   const tokenOpts: PagerDutyOpts = { token: <string>oauth2.user?.token, tokenType: 'bearer' };

   const serviceOpts: AppSelectOption[] = await getServiceOptionList(tokenOpts, call.context);
   const assignToOpts: AppSelectOption[] = await getUsersOptionList(tokenOpts, call.context);

   const service = serviceOpts.find((b) => b.value == values.incident_impacted_service || b.label == values.incident_impacted_service );
   const assign = assignToOpts.find((b) => b.value == values.incident_assign_to || b.label == values.incident_assign_to );

   const valuesData: CreateIncidentFormModalType = {
      incident_impacted_service: <AppSelectOption>service,
      incident_title: values.incident_title,
      incident_description: values.incident_description,
      incident_assign_to: <AppSelectOption>assign
   } 

   await postIncidentMethod(valuesData, tokenOpts, call.context);
}

export async function submitCreateIncident(call: AppCallRequest): Promise<any> {
   const values = call.values as CreateIncidentFormModalType;
	 const i18nObj = configureI18n(call.context);

   const oauth2: Oauth2App | undefined = call?.context?.oauth2;
   const tokenOpts: PagerDutyOpts = { token: <string>oauth2.user?.token, tokenType: 'bearer' };

   if (!values?.incident_impacted_service && !values?.incident_title) {
      throw new Error(i18nObj.__('forms.incident-create.create-incident-exception'));
   }

   await postIncidentMethod(values, tokenOpts, call.context);
}


async function postIncidentMethod(values: CreateIncidentFormModalType, pdOpt: PagerDutyOpts, context: AppContext) {
   const pdClient: PartialCall = api({ token: pdOpt.token, tokenType: pdOpt.tokenType });
	 const i18nObj = configureI18n(context);

   const incident: PostIncident = {
      incident: {
         type: "incident",
         title: values.incident_title,
         service: {
            id: values.incident_impacted_service.value,
            type: "service_reference"
         }
      }
   }

   if (!!values.incident_description) {
      incident.incident.body = {
         type: "incident_body",
         details: values.incident_description
      }
   }

   if (!!values.incident_description) {
      incident.incident.body = {
         type: "incident_body",
         details: values.incident_description
      };
   }
   if (!!values.incident_assign_to) {
      incident.incident.assignments = [
         {
            assignee: {
               id: values.incident_assign_to.value,
               type: "user"
            }
         }
      ];
   }

   await tryPromiseForGenerateMessage(
      pdClient.post(Routes.PagerDuty.IncidentsPathPrefix, { data: incident }),
      ExceptionType.MARKDOWN,
      i18nObj.__('forms.incident-create.failed')
   );
}
