import {Channel} from './mattermost';

export interface OauthUserToken {
    client_info: string;
    id_token: string;
    token_type: string;
    access_token: string;
    refresh_token: string;
    scope: string;
    expires_in: number;
}

export type AddNoteWebhook = {
    content: string;
    id: string;
    incident: {
        html_url: string;
        id: string;
        self: string;
        summary: string;
        type: string;
    };
    trimmed: boolean;
    type: string;
};

export type EventWebhook = {
    assignees: {
        html_url: string;
        id: string;
        self: string;
        summary: string;
        type: string;
    }[];
    conference_bridge: any;
    created_at: Date;
    escalation_policy: {
        html_url: string;
        id: string;
        self: string;
        summary: string;
        type: string;
    };
    html_url: string;
    id: string;
    incident_key: string;
    number: number;
    priority: string;
    resolve_reason: any;
    self: string;
    service: {
        html_url: string;
        id: string;
        self: string;
        summary: string;
        type: string;
    };
    status: string;
    teams: any[];
    title: string;
    type: string;
    urgency: string;
}

export type Incident = {
    incident_number: number;
    title: string;
    description: string;
    created_at: Date;
    status: string;
    incident_key: string;
    service: {
        id: string;
        type: string;
        summary: string;
        self: string;
        html_url: string;
    };
    assignments: any[];
    assigned_via: string;
    last_status_change_at: Date;
    first_trigger_log_entry: {
        id: string;
        type: string;
        summary: string;
        self: string;
        html_url: string;
    };
    alert_counts: {
        all: number;
        triggered: number;
        resolve: number;
    };
    is_mergeable: boolean;
    escalation_policy: {
        id: string;
        type: string;
        summary: string;
        self: string;
        html_url: string;
    };
    teams: any[];
    pending_actions: any[];
    acnowledgements: any[];
    basic_alert_grouping: any;
    alert_grouping: any;
    last_status_change_by: {
        id: string;
        type: string;
        summary: string;
        self: string;
        html_url: string;
    };
    incidents_responders: any[];
    responder_requests: any[];
    subscriber_requests: any[];
    urgency: string;
    id: string;
    type: string;
    summary: string;
    self: string;
    html_url: string;
};

export type Service = {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    status: string;
    teams: {
        id: string;
        type: string;
        summary: string;
        self: string;
        html_url: string;
    }[];
    alert_creation: string;
    addons: any[];
    scheduled_actions: any[];
    support_hours: any;
    last_incident_timestamp: any;
    escalation_policy: {
        id: string;
        type: string;
        summary: string;
        self: string;
        html_url: string;
    };
    incident_urgency_rule: {
        type: string;
        urgency: string;
    };
    acknowledgement_timeout: any;
    auto_resolve_timeout: any;
    alert_grouping: any;
    alert_grouping_timeout: any;
    alert_grouping_parameters: {
        type: string;
        config: string;
    };
    integrations: any[];
    response_play: any;
    type: string;
    summary: string;
    self: string;
    html_url: string;
};

export type WebhookSubscription = {
    active: boolean;
    delivery_method: {
        custom_headers: any[];
        extension_id: string;
        id: string;
        secret: string;
        temporarily_disabled: boolean;
        type: string;
        url: string;
    };
    description: string;
    events: string[];
    filter: {
        id: string;
        type: string;
    };
    id: string;
    type: string;
    service?: Service;
    channel?: Channel;
};

export type WebhookEvent<T> = {
    event: {
        agent: {
            html_url: string;
            id: string;
            self: string;
            summary: string;
            type: string;
        };
        client: string;
        data: T,
        event_type: string;
        id: string;
        occurred_at: Date;
        resource_type: string;
    }
};
export type GetResponse = {
   services?: Array<ServiceResponse>,
   users?: Array<UserResponse>,
   limit: number,
   offset: number,
   total: number,
   more: boolean,
};

export type ServiceResponse = {
   id: string,
   name: string,
   description: string,
   html_url: string
}

export type UserResponse = {
   id: string,
   type: 'user',
   name: string,
   email: string,
   html_url: string
}


export type PostIncident = {
   incident: {
      type: 'incident',
      title: string,
      service: {
         id: string,
         type: "service_reference"
      },
      body?: {
         type: "incident_body",
         details: string
      },
      assignments?: Array<PostIncidentAssignee>
   }
}

export type PostIncidentAssignee = {
   assignee: {
      id: string,
      type: "user"
   }
}
