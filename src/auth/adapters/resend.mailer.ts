// import { Resend } from 'resend';
// import { SETTINGS } from '../../core/settings/settings';

// if (!SETTINGS.RESEND_API_KEY) {
//     throw new Error('RESEND_API_KEY is not set');
// }

// const resend = new Resend(SETTINGS.RESEND_API_KEY);

// export type SendEmailParams = {
//     to: string;
//     subject: string;
//     html: string;
// };

// export const mailer = {
//     async send({ to, subject, html }: SendEmailParams): Promise<void> {
//         const from = SETTINGS.MAIL_FROM;
//         await resend.emails.send({ from, to, subject, html });
//     },
// };

import { Resend } from 'resend';
import { SETTINGS } from '../../core/settings/settings';

let resend: Resend | null = null;

function getClient(): Resend | null {
    if (!resend) {
        if (!SETTINGS.RESEND_API_KEY) return null;
        resend = new Resend(SETTINGS.RESEND_API_KEY);
    }
    return resend;
}

export type SendEmailParams = {
    to: string;
    subject: string;
    html: string;
};

export const mailer = {
    async send({ to, subject, html }: SendEmailParams): Promise<void> {
        const client = getClient();
        if (!client) {
            return;
        }
        await client.emails.send({
            from: SETTINGS.MAIL_FROM,
            to,
            subject,
            html,
        });
    },
};
