import '../styles/styles.css'

import { Page, InlineStack, Text, Icon, Card, Button, Checkbox, BlockStack, Banner, RangeSlider, ButtonGroup, PageActions } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import {
  TextAlignRightIcon, TextAlignLeftIcon, TextAlignCenterIcon
} from '@shopify/polaris-icons';
import { createOrUpdateBanner } from "../app.server"
import { authenticate } from "../shopify.server";
import {
  useSubmit,
} from "@remix-run/react";


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

  const submit = useSubmit();
  function handleSave() {
    const data = {
      "topValue": topValue,
      "leftValue": leftValue,
      "displayPosition": positionClasses[activeIndex],
    };
    submit(data, { method: "post" });
  }

  const [topValue, setTopValue] = useState(0);
  const [leftValue, setLeftValue] = useState(0);

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

  const [enableHover, setEnableHover] = useState(false);
  function handleHover() { setEnableHover(!enableHover) }

  const [lockAspectChecked, setLockAspectChecked] = useState(false);
  function handlelockAspectChecked() { setLockAspectChecked(!lockAspectChecked) }

  return (
    <Page title="Sticky add to cart">
      <div className='grid' style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '10px' }}>
        <div className='product-view-card'>
          <div style={{ background: '#f0f0f0', height: '400px', width: '400px', margin: '0 auto', borderRadius: '9px', boxShadow: 'var(--p-shadow-0)' }}>
            <p style={{ fontSize: '2.5rem', display: "flex", alignItems: 'center', justifyContent: 'center', height: '100%', color: '#c0c0c0' }}>
              Select Template
            </p>
          </div>
        </div>
        <Card>
          <BlockStack gap={800}>
            <InlineStack align='end'>
              <Button fullWidth={false} tone='success' variant='primary' onClick={handleSubmit}>Save</Button>
            </InlineStack>
            <InlineStack gap={1600} align='center'>
              <p style={{ fontWeight: "bold", fontSize: "1.5em", marginTop: "2px" }}>Sticky add to cart</p>
              <label className="hoverSwitchContainer" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={enableHover} onChange={handleHover} />
                <span className="slider"></span>
              </label>
            </InlineStack>
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
            <InlineStack gap={400}>
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
            <div>
              <p style={{ fontWeight: "bold", marginBottom: '5px' }}>Bar Text Alignment</p>
              <div style={{ display: 'flex' , width: '50%', transform: 'translateX(-16px)'}}>
                <Icon
                  source={TextAlignLeftIcon}
                  tone="base"
                />
                <Icon
                  source={TextAlignCenterIcon}
                  tone="base"
                />
                <Icon
                  source={TextAlignRightIcon}
                  tone="base"
                />
              </div>
              </div>
              <div>
            <p style={{ fontWeight: "bold", marginBottom: '5px' }}>Size</p>
            <InlineStack gap={400}>
              <RangeSlider
                output
                label="Height"
                min={0}
                max={1000}
                value={leftValue}
                onChange={handleLeftSliderChange}
              />
            </InlineStack>
            <InlineStack gap={400}>
              <RangeSlider
                output
                label="Width"
                min={0}
                max={1000}
                value={leftValue}
                onChange={handleLeftSliderChange}
              />
            </InlineStack>
            </div>
            <Checkbox
              label="Lock aspect ratio"
              checked={lockAspectChecked}
              onChange={handlelockAspectChecked}
            />
            <div>
            <p style={{ fontWeight: "bold", marginBottom: '5px'  }}>Show/ Hide</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Checkbox
                label="Show product image"
              //           checked={isProductPageChecked}
              //          onChange={handleDisplayPageChange("Product", isProductPageChecked, setIsProductPageChecked)}
              />
              <Checkbox
                label="Show product name"
              //           checked={isCollectionPageChecked}
              //          onChange={handleDisplayPageChange("Collection", isCollectionPageChecked, setIsCollectionPageChecked)}
              />
              <Checkbox
                label="Show variants"
              //           checked={isSearchResultPageChecked}
              //          onChange={handleDisplayPageChange("Search", isSearchResultPageChecked, setIsSearchResultPageChecked)}
              />
              <Checkbox
                label="Show price"
              //         checked={isHomePageChecked}
              //        onChange={handleDisplayPageChange("Home", isHomePageChecked, setIsHomePageChecked)}
              />
              <Checkbox
                label="Show compare at price"
              //         checked={isCartPageChecked}
              //         onChange={handleDisplayPageChange("Cart", isCartPageChecked, setIsCartPageChecked)}
              />
              <Checkbox
                label="Show quantity"
              //       checked={isOtherPageChecked}
              //      onChange={handleDisplayPageChange("Other", isOtherPageChecked, setIsOtherPageChecked)}
              />
            </div>
            </div>
            <div>
            <p style={{ fontWeight: "bold", marginBottom: '5px'  }}>Show on</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Checkbox
                label="Dekstop"
              //           checked={isProductPageChecked}
              //          onChange={handleDisplayPageChange("Product", isProductPageChecked, setIsProductPageChecked)}
              />
              <Checkbox
                label="Mobile"
              //           checked={isCollectionPageChecked}
              //          onChange={handleDisplayPageChange("Collection", isCollectionPageChecked, setIsCollectionPageChecked)}
              />
              <Checkbox
                label="Both"
              //           checked={isSearchResultPageChecked}
              //          onChange={handleDisplayPageChange("Search", isSearchResultPageChecked, setIsSearchResultPageChecked)}
              />
            </div>
            </div>
          </BlockStack>
        </Card>
      </div>
    </Page>
  );
}

export default TextFieldExample;