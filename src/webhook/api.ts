import { getWebhookMiddlewares } from './middleware';
import { Router } from 'express';
import { isWatchCampaignRequestedEvent } from './utils';
import { messaging } from 'firebase-admin';

export const webhookRouter = Router();

// Declare an HTTP POST webhook.
webhookRouter.post(`/api/v1/webhook`, ...getWebhookMiddlewares(), async (req, res) => {
  try {
    // Ignore any other event, except for watch campaign requested event.
    if (!isWatchCampaignRequestedEvent(req.body)) {
      res.sendStatus(200);
      return;
    }

    // Send a push notification to the device.
    const { data } = req.body;
    await messaging().sendToDevice(data.deviceId, {
      notification: {
        body: data.campaignUrl,
        title: 'Watch a campaign to prolong access to the WiFi',
        sound: 'default',
      },
    });
    console.log({ msg: 'Push notification has been sent', event: req.body });

    res.sendStatus(200);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});
