import db from "./db.server";
import { json } from "@remix-run/node";

export async function createOrUpdateBanner(arrayToIterate) {
    try {
        for (const obj of arrayToIterate) { // Iterate through each object in the array
            const data = {
                id: 1,
                topValue: obj.topValue,
                leftValue: obj.leftValue,
                displayPosition: obj.displayPosition,
                productHandleStr: obj.productHandleStr,
                productIdStr: obj.productIdStr,
                bgColor: obj.bgColor,
                buColor: obj.buColor,
                fontColor: obj.fontColor,
                fontSize: parseInt(obj.fontSize),
                recentlyViewed: obj.recentlyViewed,
                shop: obj.shop,
              };
              const sticky = await db.banner.findFirst({
                where: {
                      id: 1, 
                      shop: obj.shop
                },
              });
              console.log("data in createOrUpdateBanner ",obj, data)
              if(!sticky)
              {
              const createdMapping = await db.banner.create({ data });
              console.log(
                "Creating new mapping of banner and product",
                createdMapping,
              );
              }
              else
              {
                const updatedMapping = await db.banner.update({
                  where: {
                    id_shop: {
                      id: 1, 
                      shop: obj.shop
                    }
                  },
                  data,
                });
                console.log(
                  "Updating the mapping of banner and product ",
                  updatedMapping,
                );                 
              }
        }
    return json({
        ok: true,
        msg: "POST from API",
      });
    } catch (error) {
      console.error("Error processing POST request:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }


 export async function getProInfo(proId){
    const { admin } = await authenticate.admin(request);
    console.log("in getProiNFO proId ", proId);
    const response = await admin.graphql(
      `#graphql
      query {
        product(id: "${proId}") {
          title
          featuredImage
          priceRangeV2
          compareAtPriceRange
          totalInventory
        }
      }`,
    );
    
    const data = await response.json();
    console.log("in getProiNFO data ", data);
    return data;
  }
