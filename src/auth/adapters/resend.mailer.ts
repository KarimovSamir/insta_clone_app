import { Resend } from 'resend';
import { SETTINGS } from '../../core/settings/settings';

let resend: Resend | null = null;

function getClient(): Resend | null {
    console.log('[mail] getClient called');
    console.log('[mail] SETTINGS.RESEND_API_KEY exists?', !!SETTINGS.RESEND_API_KEY);

    if (!resend) {
        if (!SETTINGS.RESEND_API_KEY) {
            console.error('[mail] No RESEND_API_KEY provided!');
            return null;
        }
        resend = new Resend(SETTINGS.RESEND_API_KEY);
        console.log('[mail] New Resend client created');
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
        console.log('[mail] send() called with:', { to, subject });
        const client = getClient();

        if (!client) {
            console.error('[mail] Cannot send mail — client is null');
            return;
        }

        try {
            const result = await client.emails.send({
                from: SETTINGS.MAIL_FROM,
                to,
                subject,
                html,
            });
            console.log('[mail] Email send result:', result);
        } catch (err) {
            console.error('[mail] Email send error:', err);
            throw err;
        }
    },
};
