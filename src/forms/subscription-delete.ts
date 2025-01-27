import {PartialCall} from '@pagerduty/pdjs/build/src/api';
import {api} from '@pagerduty/pdjs';
import {AppCallRequest, AppCallValues, Oauth2App,} from '../types';
import {ExceptionType, Routes, SubscriptionDeleteForm} from '../constant';
import {configureI18n} from "../utils/translations";
import {replace, tryPromiseForGenerateMessage} from "../utils/utils";

export async function subscriptionDeleteCall(call: AppCallRequest): Promise<void> {
    const oauth2: Oauth2App | undefined = call.context.oauth2;
    const values: AppCallValues | undefined = call.values;
		const i18nObj = configureI18n(call.context);

    const subscriptionId: string = values?.[SubscriptionDeleteForm.SUBSCRIPTION_ID];

    const pdClient: PartialCall = api({ token: oauth2.user?.token, tokenType: 'bearer' });

     await tryPromiseForGenerateMessage(
        pdClient.delete(
            replace(Routes.PagerDuty.WebhookSubscriptionPathPrefix, Routes.PathsVariable.Identifier, subscriptionId)
        ),
        ExceptionType.MARKDOWN,
        i18nObj.__('forms.subcription.webhook-failed')
     );
}
