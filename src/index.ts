import axios, { AxiosError } from "axios";

// TO-DO: jsdocs

interface SendEmailArgs {
  recepient: string;
  variables: { [key: string]: string };
  template: string;
  from: { name: string; email: string };
  subject: string;
  sendAt?: Date;
}

interface RescheduleArgs {
  scheduledId: string;
  sendAt: Date;
}

interface SendEmailBody {
  key: string;
  template_name: string;
  template_content: [{ name?: string; content?: string }];
  message: {
    to: [{ email: string; name?: string; type?: "to" | "cc" | "bcc" }];
    from_email: string;
    from_name?: string;
    subject: string;
    merge_language: "mailchimp";
    global_merge_vars?: { name: string; content: string }[];
    send_at: string | null;
  };
}

const buildMergeVars = function (variables: { [key: string]: string }) {
  const returnableArray = [];
  // inspired by nadas map(v, i)
  for (let key in variables) {
    returnableArray.push({ name: key, content: variables[key] });
  }
  return returnableArray;
};

export class MailClient {
  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }
  #mandrill = axios.create({
    baseURL: "https://mandrillapp.com/api/1.0",
    headers: { Content: "Application/JSON" },
  });
  #apiKey;

  async sendEmail({
    recepient,
    variables,
    template,
    from,
    subject,
    sendAt,
  }: SendEmailArgs) {
    const mergeVars = buildMergeVars(variables);
    const requestBody: SendEmailBody = {
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
    const res = await this.#mandrill.post(
      "/messages/send-template",
      requestBody
    );
    return res.data;
  }
  async rescheduleEmail({ scheduledId, sendAt }: RescheduleArgs) {
    const requestBody = { key: this.#apiKey, id: scheduledId, send_at: sendAt };
    const res = await this.#mandrill.post("/messages/reschedule", requestBody);
    return res.data;
  }
}
