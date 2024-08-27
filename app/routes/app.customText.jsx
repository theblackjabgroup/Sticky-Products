import '../styles/styles.css'

import { Page, InlineStack, Text, Icon, Card, Button, Checkbox, BlockStack, Banner, RangeSlider, ButtonGroup, PageActions, Popover, TextField, FormLayout } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import {
  ButtonPressIcon, TextAlignLeftIcon, TextAlignCenterIcon
} from '@shopify/polaris-icons';
import { createOrUpdateBanner } from "../app.server"
import { authenticate } from "../shopify.server";
import {
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { PrismaClient } from '@prisma/client';
import { json } from "@remix-run/node";

const prisma = new PrismaClient();

export async function loader({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const widgetConfig = await prisma.banner.findUnique({
    where: {
      id_shop: {
        id: 1,
        shop: shop
      }
    }
  });
  console.log("widgetConfig ", widgetConfig);
  console.log("params.id ", params.id);
  console.log("shop", shop)
  console.log("{ widgetConfig } ", { widgetConfig });
  console.log("json({ widgetConfig }) ", json({ widgetConfig }));
  return json({ widgetConfig });
}
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

  const { widgetConfig } = useLoaderData();
  console.log("widgetConfig in TextFieldExample", widgetConfig)
  const submit = useSubmit();
  function handleSave() {

    console.log("resourcePicker products after bgColor ", bgcolor, bucolor, fontColor);
    const data = {
      "topValue": topValue,
      "leftValue": leftValue,
      "displayPosition": positionClasses[activeIndex],
      "productHandleStr": selectProductsState,
      "productIdStr": selectedProductsId,
      "bgColor": bgcolor,
      "buColor": bucolor,
      "fontColor": fontColor,
      fontSize: fontSize,
      "recentlyViewed": enableRecentlyViewed
    };
    setSelectProductsState("");
    submit(data, { method: "post" });
  }

  const [topValue, setTopValue] = useState(0);
  const [leftValue, setLeftValue] = useState(0);
  const [enableRecentlyViewed, setRecentlyViewed] = useState(false);
  const [selectProductsState, setSelectProductsState] = useState("");
  const [selectedProductsId, setSelectedProductId] = useState(0);
  const [bgcolor, setBgColor] = useState('#FFFFFF');
  const [bucolor, setBuColor] = useState('#000000');
  const [fontColor, setFontColor] = useState('#767676');

  useEffect(() => {
    if (widgetConfig) {
      setTopValue(widgetConfig.topValue || 0);
      setLeftValue(widgetConfig.leftValue || 0);
      setRecentlyViewed(widgetConfig.enableRecentlyViewed || false);
      setSelectProductsState(widgetConfig.productHandleStr || "");
      setSelectedProductId(widgetConfig.productIdStr || 0)
      setBgColor(widgetConfig.bgColor || '#FFFFFF');
      setBuColor(widgetConfig.buColor || '#000000');
      setFontColor(widgetConfig.fontColor || '#767676');
      setFontSize(widgetConfig.fontSize || 14)
    }
  }, [widgetConfig]);

  const handleTopSliderChange = useCallback((value) => {
    setTopValue(value);
  }, []);

  const handleLeftSliderChange = useCallback((value) => {
    setLeftValue(value);
  }, []);

  // use default active index
  const [activeIndex, setActiveIndex] = useState(0);

  // function to handle position grid
  const handleItemClick = (index) => {
    setActiveIndex(index); // Set the clicked item as active'
  };

  const positionClasses = [
    'top-left', 'top-right',
    'bottom-left', 'bottom-right'
  ];

  // submit handle
  const handleSubmit = () => {
    handleSave()
  }

  function handleRecentlyViewed() {
    setRecentlyViewed(prevState => {
      const newState = !prevState;
      document.documentElement.style.setProperty(
        '--main-bb-slider-color',
        newState ? "#279002" : "#D9D9D9"
      );
      return newState;
    });
  }

  const [lockAspectChecked, setLockAspectChecked] = useState(false);
  function handlelockAspectChecked() { setLockAspectChecked(!lockAspectChecked) }


  async function selectProductImage() {
    var selectionIds = [];
    if (widgetConfig) {
      console.log("widgetConfig.productIdStr ", widgetConfig.productIdStr)
      selectionIds = widgetConfig.productIdStr.split(',').map(id => ({
        id: `${id.trim()}`
      }));
    }
    console.log("selectionIds ", selectionIds);
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select", // customized action verb, either 'select' or 'add',
      multiple: 3,
      selectionIds: selectionIds,
    });

    console.log("resourcePicker products ", products);

    if (products) {
      var handleStr = "";
      var idStr = "";
      products.forEach((pro, index) => {
        const { handle, id } = pro;
        console.log("Selected product handle:", handle, id);
        handleStr += handle;
        idStr += id;
        
        if (index < products.length - 1) {
          handleStr += ",";
          idStr += ",";
        }
      });

      console.log("Selected product handleStr:", handleStr);
      setSelectProductsState(handleStr);
      setSelectedProductId(idStr);
    }
    console.log("resourcePicker products after ", selectProductsState);
  }
  const toggleBgColorPicker = (value) => setBgColor(value);
  const toggleBuColorPicker = (value) => setBuColor(value);
  const toggleFontColorPicker = (value) => setFontColor(value);

  function getFontSizeBasedOnScreen() {
    if (typeof window !== "undefined") {
      console.log("Nikhil inside window2")
      const width = window.innerWidth;
      if (width < 1450) {
        return 11; // Example: medium font size for tablets
      } else {
        return 14; // Example: larger font size for desktops
      }
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Nikhil inside window")
      // Update font size on initial render
      setFontSize(getFontSizeBasedOnScreen());

      // Event handler for resizing
      const handleResize = () => {
        setFontSize(getFontSizeBasedOnScreen());
      };

      // Add event listener for resize
      window.addEventListener('resize', handleResize);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);


  const [fontSize, setFontSize] = useState(getFontSizeBasedOnScreen());

  const handleFontSize = (value) => setFontSize(value);

  return (
    <Page title="Recently Viewed">
      <div className='grid' style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '10px' }}>
        <div className='product-view-card'>
          <div style={{ height: '900px', background: 'white', borderRadius: '9px', boxShadow: 'var(--p-shadow-0)', paddingTop: '50px' }}>
            <div class="bb-container" style={{ backgroundColor: bgcolor }}>
              <button class="bb-close-btn">x</button>
              <div class="bb-inner-container">
                <div class="bb-banner" style={{ backgroundColor: bgcolor, color: fontColor }}>
                  <img src="//cdn.shopify.com/s/files/1/0799/0158/9799/files/casual-fashion-woman_925x_d0d36c27-3415-451f-bb47-f90d95fb7ee1.jpg?v=1714067302" class="bb-pro-img" />
                </div>
                <div class="bb-banner" style={{ backgroundColor: bgcolor, color: fontColor, fontSize: fontSize }}>
                  Classic V...
                </div>
                <div class="bb-banner" style={{ backgroundColor: bgcolor, color: fontColor, fontSize: fontSize }}>60.00</div>
                <div class="bb-upper-label bb-upper-label-sold"><div class="bb-label">Sold Out</div></div>
                <div class="bb-upperButtonDiv">
                  <button class="bb-inner-button" style={{ backgroundColor: bucolor, fontSize: fontSize }}>Buy Now</button></div>
              </div>
              <div class="bb-line">
                <div class="bb-child-line">
                </div>
              </div>
              <div class="bb-inner-container">
                <div class="bb-banner" style={{ backgroundColor: bgcolor, color: fontColor }}>
                  <img src="//cdn.shopify.com/s/files/1/0799/0158/9799/files/dark-wall-bedside-table_925x_10e5b8ba-a57c-4651-a5e9-fce49a2f3ebd.jpg?v=1714064469" class="bb-pro-img" />
                </div>
                <div class="bb-banner" style={{ backgroundColor: bgcolor, color: fontColor, fontSize: fontSize }}>
                  Bedside T...
                </div>
                <div class="bb-banner" style={{ lineHeight: '1', backgroundColor: bgcolor, color: fontColor }}>
                  <div style={{ textDecoration: 'line-through', fontSize: fontSize }}>85.00</div>
                  <div style={{ fontSize: fontSize }}>69.99</div>
                </div>
                <div class="bb-upper-label bb-upper-label-sale">
                  <div class="bb-label">On Sale</div>
                </div>
                <div class="bb-upperButtonDiv">
                  <button class="bb-inner-button" style={{ backgroundColor: bucolor, fontSize: fontSize }}>Buy Now</button>
                </div>
              </div>
              <div class="bb-line">
                <div class="bb-child-line">
                </div>
              </div>
              <div class="bb-inner-container" style={{ marginBottom: '0px' }}>
                <div class="bb-banner" style={{ backgroundColor: bgcolor, color: fontColor }}>
                  <img src="//cdn.shopify.com/s/files/1/0799/0158/9799/files/comfortable-living-room-cat_925x_b270a759-b837-47c8-8717-c4c747a2b42b.jpg?v=1714064467" class="bb-pro-img" />
                </div>
                <div class="bb-banner" style={{ backgroundColor: bgcolor, color: fontColor, fontSize: fontSize }}>
                  Black Bea...
                </div>
                <div class="bb-banner" style={{ lineHeight: '1', backgroundColor: bgcolor, color: fontColor }}>
                  <div style={{ textDecoration: 'line-through', fontSize: fontSize }}>80.00</div>
                  <div style={{ fontSize: fontSize }}>69.99</div>
                </div>
                <div class="bb-upper-label bb-upper-label-sale">
                  <div class="bb-label">On Sale</div>
                </div>
                <div class="bb-upperButtonDiv">
                  <button class="bb-inner-button" style={{ backgroundColor: bucolor }}>Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Card>
          <BlockStack gap={1000}>
            <BlockStack gap={200}>
              <p style={{ fontWeight: "bold", marginBottom: '5px' }}>Bar position</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', justifyContent: 'center' }}>
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    style={{ border: `1px solid ${activeIndex === index ? 'var(--p-color-bg-fill-info-active)' : '#b0b0b0'}`, width: '100%', height: '60px', borderRadius: '0.25rem', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer', backgroundColor: `${activeIndex === index ? 'var(--p-color-bg-fill-info-active)' : 'white'}`, color: `${activeIndex === index ? '#fff' : 'var(--p-color-bg-fill-inverse-active)'}` }}
                    onClick={() => handleItemClick(index)}
                  >
                    {/* <div className="grid-item-inner"></div> */}
                    <p style={{ textTransform: 'capitalize', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>{positionClasses[index]}</p>
                  </div>
                ))}
              </div>
            </BlockStack>
            <InlineStack gap={1600}>
              <RangeSlider
                output
                label={<p style={{ fontWeight: "bold" }}>  Bar position ( Up / Down ) </p>}
                min={0}
                max={1000}
                value={topValue}
                onChange={handleTopSliderChange}
              />
            </InlineStack>
            <InlineStack gap={400}>
              <RangeSlider
                output
                label={<p style={{ fontWeight: "bold" }}> Bar position (Left  / Right ) </p>}
                min={0}
                max={1000}
                value={leftValue}
                onChange={handleLeftSliderChange}
              />
            </InlineStack>
            <BlockStack gap={400}>
              <InlineStack gap={1600}>
                <p style={{ fontWeight: "bold", fontSize: "1.5em", marginTop: "4px" }}>Recently Viewed</p>
                <label className="hoverSwitchContainer" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={enableRecentlyViewed} onChange={handleRecentlyViewed} />
                  <span className="slider"></span>
                </label>
              </InlineStack>
              <p style={{ fontSize: "1em" }}>(You can switch to recently viewed products if you don’t want to have sticky products)</p>
            </BlockStack>
            <BlockStack gap={400}>
              <Button variant='primary' fullWidth onClick={selectProductImage} disabled={enableRecentlyViewed}>
                <InlineStack gap={400} align='center'>
                  Select Product
                  <Icon source={ButtonPressIcon} tone="base" />
                </InlineStack>
              </Button>
              <p style={{ fontSize: "1em" }}>(You can select upto 3 products)</p>
            </BlockStack>
            <FormLayout>
              <FormLayout.Group condensed>
                <TextField
                  label={<p style={{ fontWeight: "bold" }}> Background color </p>}
                  type='color'
                  value={bgcolor}
                  onChange={toggleBgColorPicker}
                />
                <TextField
                  label={<p style={{ fontWeight: "bold" }}> Button color </p>}
                  type='color'
                  value={bucolor}
                  onChange={toggleBuColorPicker}
                />
              </FormLayout.Group>
            </FormLayout>
            <FormLayout>
              <FormLayout.Group condensed>
                <TextField
                  label={<p style={{ fontWeight: "bold" }}> Font color </p>}
                  type='color'
                  value={fontColor}
                  onChange={toggleFontColorPicker}
                />
                <TextField
                  label={<p style={{ fontWeight: "bold" }}> Font Size </p>}
                  type="number"
                  value={fontSize}
                  onChange={handleFontSize}
                  suffix="px"
                  autoComplete="off"
                />
              </FormLayout.Group>
            </FormLayout>
            <InlineStack align='center'>
              <Button fullWidth={false} tone='success' variant='primary' onClick={handleSubmit}>Save</Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </div>
    </Page>
  );
}

export default TextFieldExample;