import { getWebhookMiddlewares } from './middleware';
import { Router } from 'express';
import { isWatchCampaignRequestedEvent } from './utils';
import { messaging } from 'firebase-admin';
import util from 'util';

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
    await messaging().send({
      token: data.deviceId,
      notification: {
        title: data.notification.title ?? 'Watch a campaign to prolong access to the WiFi',
        body: data.notification.body ?? '',
      },
      data: {
        campaignUrl: data.campaignUrl,
      },
    });
    console.log(
      util.inspect(
        { msg: 'Push notification has been sent', event: req.body },
        { depth: null, colors: true }
      )
    );

    res.sendStatus(200);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});
