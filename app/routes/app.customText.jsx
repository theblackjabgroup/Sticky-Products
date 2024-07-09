import {TextField} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { createOrUpdateBanner } from "../app.server"
import { authenticate } from "../shopify.server";
import {
  useSubmit,
} from "@remix-run/react";
import {
  PageActions,
  Page,
} from "@shopify/polaris";


export async function action({ request, params }) {
  console.log("inside action ", params);
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const labelProductObjs = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };

  console.log("object ", labelProductObjs)
  const arrayToIterate = [labelProductObjs];
  const result = createOrUpdateBanner(arrayToIterate);
  return result;
}

function TextFieldExample() {
  const [value, setValue] = useState('Demo Banner Of Blackbytt');

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const submit = useSubmit();
  function handleSave() {
    const data = {
      "bannerText": value,
    };
    submit(data, { method: "post" });
  }

  return (
    <Page>
    <TextField
      label="Store name"
      value={value}
      onChange={handleChange}
      autoComplete="off"
    />
    <PageActions
    primaryAction={{
      content: "Save",
      onAction: handleSave,
    }}
  />
  </Page>
  );
}

export default TextFieldExample;