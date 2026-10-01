# Catering email and staff SMS alerts

## Activation status

The SMS integration is implemented but OFF by default. Committing code or publishing GitHub Pages does not configure Twilio, deploy this separate Node API, or prove phone delivery. No real SMS was sent by the development tests.

## Behavior

Only POST /api/catering-request uses this integration. The server first sends the existing catering email. After SMTP accepts it, it attempts one separate SMS per configured staff recipient (maximum two). It does not monitor Gmail, other incoming emails, or Clover payments. SMTP acceptance is not proof of inbox placement. Twilio API acceptance is not proof of delivery to a handset.

Message:

> Beyond Natural & Co.: New catering quote request. Please check beyondnaturalandco@gmail.com. Reply STOP to unsubscribe.

The SMS includes no customer's name, address, phone number, or catering details. A failed SMS does not fail a successfully sent email or prompt a customer to submit it again. The existing Clover payment routes are unchanged.

## Private server configuration

Set these in the hosting environment of the Node API, not in GitHub Pages or any VITE_ variable. Keep the two owner-designated destination numbers and all credentials out of the public repository.

```dotenv
CATERING_SMS_ENABLED=false
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
TWILIO_MESSAGING_SERVICE_SID=
CATERING_SMS_TO=
CATERING_SMS_MAX_PER_HOUR=60
```

CATERING_SMS_TO must contain the one or two authorized staff numbers, including the +1 country code for US recipients, separated by a comma. The website cannot change the destination numbers. Supply either a Twilio SMS-capable FROM number belonging to the account, or a Messaging Service SID with an eligible sender. If a Messaging Service SID is provided, it takes precedence over FROM.

The Gmail SMTP_USER and SMTP_PASS settings must already work. CATERING_EMAIL_TO should remain beyondnaturalandco@gmail.com for the current SMS wording.

Obtain agreement from both recipients before activation. Complete the applicable US sender registration/verification and configure opt-out handling. Local US 10DLC senders require A2P registration; toll-free senders have their own verification. Trial accounts require verified destination numbers. Ensure the business has approved provider fees; this change does not buy a number or activate billing.

Deploy the complete server directory to the existing Node 22 API service and restart it. Only after credentials, both recipients, sender approval, and consent are in place should CATERING_SMS_ENABLED be set to true. No customer-facing layout changes are required.

## Verification

```sh
cd server
npm run build
npm test
```

Tests mock SMTP and HTTP and do not use real credentials or send real messages. After authorized activation, submit one clearly identified test from the form and verify the email and both phones. Check Twilio message logs for final delivery status and any provider errors. /health exposes only cateringSmsEnabled and cateringSmsConfigured booleans; configured indicates local settings are present and syntactically valid, not authenticated or carrier-approved.

## Safety and limitations

Requests identical in recipient, subject, and email text are SMS-deduplicated for five minutes. The default safety cap is 60 individual SMS attempts per rolling hour per server process, so 30 two-recipient requests; emails continue if the cap is reached, and a warning is logged. Adjust CATERING_SMS_MAX_PER_HOUR (2-200) after reviewing normal volume. The cap is not an account-wide spending limit.

HTTP attempts run independently with an eight-second timeout. Logs mask phone numbers and omit provider bodies and credentials. There are no automatic retries after an ambiguous response, avoiding duplicate SMS. Deduplication and counters are in memory and reset on restart; for multiple instances or durable delivery guarantees use a shared queue/store and verified delivery callbacks. Keep upstream anti-spam protection and provider spending alerts enabled. Do not rely on SMS as the only record; email remains primary.

## Provider references

- https://www.twilio.com/docs/messaging/api/message-resource
- https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
- https://www.twilio.com/docs/trust-hub/registrations
- https://www.twilio.com/en-us/sms/pricing/us
