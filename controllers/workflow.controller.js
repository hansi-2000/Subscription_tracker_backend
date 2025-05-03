// To automatically send reminder emails before a user's subscription renewal date. Reminders are sent 7, 5, 2, and 1 days before the renewalDate.

import dayjs from 'dayjs'  // for date/time handling
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");  // for sheduled jobs
import Subscription from '../model/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload; // Extracts the subscriptionId from the request payload.
  const subscription = await fetchSubscription(context, subscriptionId);  // Calls fetchSubscription() to load that subscription from MongoDB.

  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);  // Convert the stored renewal date into a dayjs object for date calculations.

  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    // If the reminder date is in the future, tell Upstash to pause execution until that time.
    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    // Once the reminder day arrives, it triggers the actual email via triggerReminder().
    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

// Retrieves the subscription from the database. The context.run() block tracks this execution as a named step in the Upstash workflow.
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}

// Tells Upstash to pause the workflow until date. label gives a name to this pause step (for logging/debugging).
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}