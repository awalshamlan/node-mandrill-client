import axios from "axios";
const buildMergeVars = function (variables) {
    const returnableArray = [];
    // inspired by nadas map(v, i)
    for (let key in variables) {
        returnableArray.push({ name: key, content: variables[key] });
    }
    return returnableArray;
};
export class MailClient {
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }
    #mandrill = axios.create({
        baseURL: "https://mandrillapp.com/api/1.0",
        headers: { Content: "Application/JSON" },
    });
    #apiKey;
    async sendEmail({ recepient, variables, template, from, subject, sendAt, }) {
        const mergeVars = buildMergeVars(variables);
        const requestBody = {
            key: this.#apiKey,
            template_name: template,
            template_content: [{}],
            message: {
                merge_language: "mailchimp",
                subject: subject,
                from_email: from.email,
                from_name: from.name ?? "",
                global_merge_vars: mergeVars,
                send_at: sendAt?.toISOString() ?? null,
                to: [{ email: recepient }],
            },
        };
        const res = await this.#mandrill.post("/messages/send-template", requestBody);
        return res.data;
    }
    async rescheduleEmail({ scheduledId, sendAt }) {
        const requestBody = { key: this.#apiKey, id: scheduledId, send_at: sendAt };
        const res = await this.#mandrill.post("/messages/reschedule", requestBody);
        return res.data;
    }
    async cancelScheduledEmail(id) {
        const requestBody = { id, key: this.#apiKey };
        const res = await this.#mandrill.post("/messages/cancel-scheduled", requestBody);
        return res.data;
    }
}
