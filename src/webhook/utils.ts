import { WatchCampaignEvent, WebhookEventType } from './types';

export function isWatchCampaignRequestedEvent(ev: any): ev is WatchCampaignEvent {
  return ev?.type === WebhookEventType.WATCH_CAMPAIGN_REQUESTED_EVENT;
}
