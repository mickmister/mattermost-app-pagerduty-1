import { api, APIResponse, PartialCall } from "@pagerduty/pdjs/build/src/api";
import { MattermostClient, MattermostOptions } from "../clients/mattermost";
import { ExceptionType, Routes } from "../constant";
import { AppAttachmentField, AppCallRequest, AppCallValues, AppField, Incident, Oauth2App, PostEphemeralCreate } from "../types";
import { h6, hyperlink } from "../utils/markdown";
import { replace, tryPromiseForGenerateMessage } from "../utils/utils";
import { configureI18n } from "../utils/translations";

export async function showIncidentDetailPost(call: AppCallRequest): Promise<any> {
   const oauth2: Oauth2App | undefined = call.context.oauth2;
   const incidentValues: AppCallValues | undefined = call.state.incident;
   const incidentId: string = incidentValues?.id;
	 const i18nObj = configureI18n(call.context);

   const pdClient: PartialCall = api({ token: oauth2.user?.token, tokenType: 'bearer' });

   const responseIncident: APIResponse = await tryPromiseForGenerateMessage(
      pdClient.get(
         replace(Routes.PagerDuty.IncidentPathPrefix, Routes.PathsVariable.Identifier, incidentId)
      ),
      ExceptionType.MARKDOWN,
      i18nObj.__('forms.incident-detail.exception')
   );

   const incident: Incident = responseIncident.data['incident'];
   
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const channelId: string | undefined = call.context.post?.channel_id;

   const fields: AppAttachmentField[] = [
      {
         short: false,
         title: i18nObj.__('forms.incident-detail.title-decription'),
         value: `${incident.description}`,
      },
      {
         short: true,
         title: i18nObj.__('forms.incident-detail.title-service'),
         value: h6(`${hyperlink(`${incident.service.summary}`, incident.service.html_url)}`),
      },
      {
         short: true,
         title: i18nObj.__('forms.incident-detail.title-policy'),
         value: h6(`${hyperlink(`${incident.escalation_policy.summary}`, incident.escalation_policy.html_url)}`),
      }
   ]

   const priority = incident?.priority;
   if (!!priority) {
      fields.push(
         {
            short: true,
            title: i18nObj.__('forms.incident-detail.title-priority'),
            value: `${priority.summary} (${`${incident.urgency}`.toUpperCase()})`,
         }
      );
   } else {
      fields.push(
         {
            short: true,   
            title: i18nObj.__('forms.incident-detail.title-urgency'),
            value: `${incident.urgency}`.toUpperCase(),
         }
      );
   }

   const assignee = incident?.assignments[0]?.assignee;
   if (!!assignee) {
      fields.push(
         {
            short: true,
            title: i18nObj.__('forms.incident-detail.title-asignee'),
            value: h6(`${hyperlink(`${assignee.summary}`, assignee.html_url)}`),
         }
      );
   }

   let post: any = {
      user_id: <string>call.context.acting_user?.id,
      post: {
         message: "",
         channel_id: <string>channelId,
         props: {
            attachments: [
               {
									 title: h6(i18nObj.__('forms.incident-detail.title-incident')),
                  title_link: '',
                  fields: fields
               }
            ]
         }
      }
   }

   const mattermostOptions: MattermostOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
   
   await mattermostClient.createEphemeralPost(post);
}
