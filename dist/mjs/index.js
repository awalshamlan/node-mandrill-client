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
    sendEmail({ recepient, variables, template, from, subject, sendAt }) {
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
                send_at: sendAt?.toUTCString() ?? null,
                to: [{ email: recepient }],
            },
        };
        return this.#mandrill.post("/messages/send-template", requestBody);
    }
    scheduleEmail() {
        //TODO
    }
}
