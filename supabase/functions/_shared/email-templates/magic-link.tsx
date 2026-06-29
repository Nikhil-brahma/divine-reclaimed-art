/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #e6d49a', marginBottom: '24px' }}>
          <Heading style={{ fontSize: '24px', color: '#8b0000', margin: 0, letterSpacing: '3px' }}>PUNARVSU</Heading>
          <Text style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '3px', margin: '6px 0 0' }}>BLESSINGS IN PHYSICAL FORM</Text>
        </div>
        <Heading style={h1}>Your login link</Heading>
        <Text style={text}>
          Click the button below to log in to {siteName}. This link will expire
          shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Log In
        </Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
        <Text style={{ fontSize: '11px', color: '#8a7a5a', textAlign: 'center', marginTop: '32px', borderTop: '1px solid #e6d49a', paddingTop: '16px' }}>
          Punarvsu · A sacred upcycling initiative · <Link href="https://punarvsu.com" style={{ color: '#8b0000' }}>punarvsu.com</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#3a2a1a' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#8b0000',
  margin: '0 0 20px',
  letterSpacing: '0.5px',
}
const text = {
  fontSize: '14px',
  color: '#3a2a1a',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: '#8b0000',
  color: '#ffffff',
  fontWeight: 'bold' as const,
  letterSpacing: '1px',
  fontSize: '14px',
  borderRadius: '4px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#8a7a5a', margin: '30px 0 0' }
