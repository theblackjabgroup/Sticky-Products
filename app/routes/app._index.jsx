import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { Banner, BlockStack, Button, Card, InlineGrid, InlineStack, Page, Text, Thumbnail } from '@shopify/polaris';
import step_one from '../assets/step_one.png'
import step_two from '../assets/step_two.png'
import step_three from '../assets/step_three.png'
import installation_guide from '../assets/installation_guide.png'
import support from '../assets/support.png'
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const navigate = useNavigate()

  return (
    <Page>
      <BlockStack gap={400}>
        <Text variant="headingXl" as="h4">
          Welcome to Blackbytt - Sticky cart
        </Text>
        <InlineGrid gap="400" columns={3}>
          <Card>
            <BlockStack align='space-between' gap={800} inlineAlign='center'>
            <img alt="" width="100%" height="100%" style={{ objectFit: 'cover', objectPosition: 'center', maxHeight: '300px' }} src={step_one} />
            <Text variant='headingMd' alignment='justify'>Step 1 : Integrate our app into your Shopify theme.</Text>
            <p style={{ textAlign: 'justify' }}>To enter the Theme Editor page, click the "Enabled app embed" button below, then activate our app and click "Save".</p>
            <div style={{ margin: '1.15rem auto' }}>
                  <Button variant='primary' target='_blank' url='https://admin.shopify.com/admin/themes/current/editor?context=apps&template=index' onClick={() => triggerMixPanel('Enable App', 'Enable App Button', 'Enable App Button Clicked')}>Enable App Embed</Button>
            </div>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack align='space-between' gap={1000} inlineAlign='center'>
            <img alt="" width="100%" height="100%" style={{ objectFit: 'cover', objectPosition: 'center', maxHeight: '300px' }} src={step_two} />
                  <Text variant='headingMd' alignment='justify'>Step 2: Go to sticky product tab.</Text>
                  <p style={{ textAlign: 'justify' }}>To begin designing your sticky product widget go to sticky product tab. </p>
                  <div style={{ margin: '2rem auto' }}>
                    <Button variant='primary' onClick={() => { navigate('./recently-viewed'); }}>Sticky products</Button>
              </div>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack align='space-between' gap={1000} inlineAlign='center'>
            <img alt="" width="100%" height="100%" style={{ objectFit: 'cover', objectPosition: 'center', maxHeight: '300px' }} src={step_three} />
                <Text variant='headingMd' alignment='justify'>Step 3: Customize widget</Text>
                <p style={{ textAlign: 'justify' }}>Customize your sticky products widget according to your store aesthetics.</p>
                <div style={{ margin: '2rem auto' }}>
                <Button variant='primary' onClick={() => { navigate('./recently-viewed'); }}>Customize</Button>
                </div>
            </BlockStack>
          </Card>
        </InlineGrid>
        <Card padding={600}>
            <InlineStack gap={400}>
              <Thumbnail size='medium' source={installation_guide} />
              <InlineStack gap={'1200'} wrap={false} blockAlign='center'>
                <BlockStack align='start' >
                  <strong>Installation Guide</strong>
                  <p>Easily install Shopify Badges and Labels. Check our installation guide for more details.</p>
                </BlockStack>
                {/* <Button size='micro' variant='primary'>Read Installation Guide</Button> */}
                <a href="https://www.blackbytt.in/installation-guide-1" rel="noreferrer" target='_blank'><button style={{ cursor: 'pointer', display: 'inline-flex', boxSizing: 'border-box', boxShadow: 'var(--p-shadow-button-primary-inset)', background: 'var(--p-color-button-gradient-bg-fill), var(--p-color-bg-fill-brand)', padding: 'var(--p-space-150) var(--p-space-300)', border: 'none', borderRadius: 'var(--p-border-radius-200)', fontFamily: 'var(--p-font-family-sans)', color: 'var(--p-color-text-brand-on-bg-fill)' }} className=''>Read Installation Guide</button></a>
              </InlineStack>
            </InlineStack>
          </Card>
          <Card>
            <InlineStack align='space-between' blockAlign='start'>
              <BlockStack gap={300} inlineAlign='start' align='space-between'>
                <Text variant='headingLg'>
                  Need Help ?
                </Text>
                <p style={{ color: '#5C5F62' }} variant='bodyLg'>
                  Connect with us without hesitation, we're here for you!
                </p>
                <p style={{ color: '#5C5F62' }}>
                  theblackjabgroup@gmail.com
                </p>
                <a target='_blank' variant={'primary'} href="mailto:theblackjabgroup@gmail.com" rel="noreferrer">
                  <Button variant='primary'>
                    Contact
                  </Button>
                </a>
              </BlockStack>
              <img width={125} src={support} alt="" />
            </InlineStack>
          </Card>
      </BlockStack>
    </Page>
  );
}
