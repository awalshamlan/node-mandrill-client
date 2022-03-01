interface SendEmailArgs {
    recepient: string;
    variables: {
        [key: string]: string;
    };
    template: string;
    from: {
        name: string;
        email: string;
    };
    subject: string;
    sendAt?: Date;
}
export declare class MailClient {
    #private;
    constructor(apiKey: string);
    sendEmail({ recepient, variables, template, from, subject, sendAt }: SendEmailArgs): Promise<import("axios").AxiosResponse<any, any>>;
    scheduleEmail(): void;
}
export {};
