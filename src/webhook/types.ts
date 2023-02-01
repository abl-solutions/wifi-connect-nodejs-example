// Declare event type and interface of the event.
export enum WebhookEventType {
  WATCH_CAMPAIGN_REQUESTED_EVENT = 'io.abl-solutions.connectivity.watch-campaign-requested',
}

export interface WatchCampaignEvent {
  id: string;
  source: string;
  type: WebhookEventType.WATCH_CAMPAIGN_REQUESTED_EVENT;
  datacontenttype: string;
  specversion: string;
  time: string;
  data: {
    subject: string;
    deviceId: string;
    campaignUrl: string;
    notification: {
      title: string | null;
      body: string | null;
    };
  };
}
