import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Banner, BlockStack, Button, Card, InlineGrid, InlineStack, Page, Text, Thumbnail } from '@shopify/polaris';
import step_one from '../assets/step_one.png'
import step_two from '../assets/step_two.png'
import step_three from '../assets/step_three.png'
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
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
            <BlockStack align='space-between' gap={800} inlineAlign='center'>
            <img alt="" width="100%" height="100%" style={{ objectFit: 'cover', objectPosition: 'center', maxHeight: '300px' }} src={step_two} />
                  <Text variant='headingMd' alignment='justify'>Step 2: Go to sticky product tab.</Text>
                  <p style={{ textAlign: 'justify' }}>To begin designing your sticky product widget go to sticky product tab. </p>
                  <div style={{ margin: '1.15rem auto' }}>
                    <Button variant='primary' onClick={() => { navigate('./recently-viewed'); }}>Sticky products</Button>
              </div>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack align='space-between' gap={800} inlineAlign='center'>
            <img alt="" width="100%" height="100%" style={{ objectFit: 'cover', objectPosition: 'center', maxHeight: '300px' }} src={step_three} />
                <Text variant='headingMd' alignment='justify'>Step 3: Customize widget</Text>
                <p style={{ textAlign: 'justify' }}>Customize your sticky products widget according to your store aesthetics.</p>
                <Button variant='primary' onClick={() => { navigate('./recently-viewed'); }}>Customize</Button>
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
