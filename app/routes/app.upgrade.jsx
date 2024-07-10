// import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";
// export async function loader({ request }) {
//   const { billing, session } = await authenticate.admin(request);
//   let { shop } = session;
//   const { plan_item } = new URLSearchParams(request.url.search);
//   console.log("the plan is :", plan_item);
// let myShop = shop.replace(".myshopify.com", "");
// await billing.require({
//   plans: [MONTHLY_PLAN, ANNUAL_PLAN],
// onFailure: async () => billing.request({
//   plan: plan_item === 'monthly' ? MONTHLY_PLAN : ANNUAL_PLAN,
//   isTest: true,
//  returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments`,
//  }),
//  });

//  return null; }


// import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";

// export async function loader({ request }) {
//   const { billing, session } = await authenticate.admin(request);
//   let { shop } = session;

//   let myShop = shop.replace(".myshopify.com", "");
//   let url = new URL(request.url);
//   let plan_item = url.searchParams.get('plan_item') || 'monthly';
  
//   let plan = plan_item === 'monthly' ? MONTHLY_PLAN : ANNUAL_PLAN;

//   await billing.require({
//     plans: [MONTHLY_PLAN, ANNUAL_PLAN],
//     onFailure: async () => billing.request({
//       plan: plan,
//       isTest: true,
//       returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments?upgrade_initiated=true`,
//     }),
//   });

//   return null;
// }

import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";

export async function loader({ request }) {
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;

  let myShop = shop.replace(".myshopify.com", "");
  let url = new URL(request.url);
  let plan_item = url.searchParams.get('plan_item') || 'monthly';
  
  let selectedPlan = plan_item === 'monthly' ? MONTHLY_PLAN : ANNUAL_PLAN;

  // Check current billing plans
  const { hasActivePayment, appSubscriptions } = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: true,
  });

  console.log('hasActivePayment:', hasActivePayment);
  console.log('appSubscriptions:', appSubscriptions);

  if (hasActivePayment && appSubscriptions && appSubscriptions.length > 0) {
    const currentPlan = appSubscriptions[0].name;

    // Check if the current plan is different from the selected plan
    if ((plan_item === 'monthly' && currentPlan !== 'Monthly Subscription') ||
        (plan_item !== 'monthly' && currentPlan !== 'Annual Subscription')) {
      // Initiate the plan change
      await billing.request({
        plan: selectedPlan,
        isTest: true,
        returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments?upgrade_initiated=true`,
        
      });
    } else {
      // Return to the payments page without initiating a new billing request
      return {
        redirect: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments`,
      };
    }
  } else {
    // If no active subscription is found, request the selected plan
    await billing.request({
      plan: selectedPlan,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/payments?upgrade_initiated=true`,
    });
  }

  return null;
}






//<Button tone={ !isOnPaidPlan ? 'success' : undefined} disabled={!isOnPaidPlan}  url={cancelButtonUrl} variant={isOnPaidPlan ? 'secondary' : 'primary'} size='large' onClick={() => { handleCancelAndRedirect()}}>{ !isOnPaidPlan ? 'Select Plan' : 'Downgrade'}</Button>
//<Button tone={(activeButtonIndex===0 && plan.name==='Annual Subscription') ? undefined : 'success'} disabled={(activeButtonIndex===0 && plan.name==='Monthly Subscription') || (activeButtonIndex===1 && plan.name==='Annual Subscription')} url={upgradeButtonUrl} variant={(activeButtonIndex===0 && plan.name==='Annual Subscription') ? 'secondary' : 'primary'} size='large' onClick={() => { handlePlanUpgrade()}}>{(activeButtonIndex===0 && plan.name==='Annual Subscription') ? 'Downgrade' : 'Select Plan' }</Button>