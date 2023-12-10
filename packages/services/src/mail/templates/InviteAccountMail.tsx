import type { Mail } from '@pedaki/mailer/type.ts';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Link } from '@react-email/link';
import * as React from 'react';
import { FROM_EMAIL_NO_REPLY } from '../constants.ts';

const InviteAccountMail: Mail<{
  name: string;
  url: string;
}> = ({ name = 'name', url = 'https://example.com/auth/activate?token=token' }) => {
  return (
    <Html>
      <Head />
      <span>Hello {name},</span>
      <Link href={url} target="_blank">
        Cliquez ici pour initialiser votre compte
      </Link>
    </Html>
  );
};

InviteAccountMail.sender = FROM_EMAIL_NO_REPLY;
InviteAccountMail.subject = () => `Initialiser votre compte`;

export default InviteAccountMail;
