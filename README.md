
# mandrill node client

A super simple mandrill client.

### This client can:
- Send emails based on a template
- Set variables within emails
- Schedule emails
- Reschedule emails (provided you saved the schedule id)
### This client is:
- Well typed (i think)
- Super simple
### This client requires:
- A valid mandrill api key
- Email templates in mandrill
## Usage example
### Initialize Client 
Here you'll need a Mandrill API Key. Check out [Mailchimp Transaction documentation](https://mailchimp.com/developer/transactional/guides/quick-start/#generate-your-api-key) for more info.

> Note: Mailchimp Transactional is just a name for mandrill.

```
import { MailClient } from  "simple-mandrill-client";
const mail = new MailClient(YOUR_MANDRILL_API_KEY_HERE);
```

### Send email
For sending and scheduling emails you'll need a template defined.
My preferred way of doing this is to create the template in Mailchimp first and then sending the template to mandrill.
There are many ways to define a template; pick your favorite.
```
mail.sendEmail({
	from: {
		email: "myemail@mydomain.com",
		name: "My name",
	},
	recepient: recepient-email@domain.com,
	subject: `Subject Line`,
	template: `template-name`,
	variables: {
		VARIABLE_A: foo,
		VARIABLE_B: bar
	} // merge fields as defined in template (can also be {} if you don't have any variables)
});
```
### Schedule and Reschedule Email
```
const sendAtDate = new Date("2025-01-01T00:00:00+00:00"); // jan 1st 2025 midnight
cosnt id = await mail.sendEmail({
	from: {
		email: "myemail@mydomain.com",
		name: "My name",
	},
	recepient: recepient-email@domain.com,
	subject: `Subject Line`,
	template: `template-name`,
	variables: {
		VARIABLE_A: foo,
		VARIABLE_B: bar
	},
	sendAt: sendAtDate
}).then(res=>res[0].id) // get the id from the response
// the id could be undefined if the email didn't get scheduled (bad template, bad email, etc.)
if(id){
	// reschedule the email
	const newDate = new Date(""2025-01-01T12:00:00+00:00"")
	rescheduleEmail({scheduledId: id, sendAt: newDate});
} 

```

> Note that if the date is in the past; the email will be sent immediately  .

### Canceled Scheduled Email

`mail.cancelScheduledEmail(id)`

> the `id` variable used here should be taken from the sendEmail response

