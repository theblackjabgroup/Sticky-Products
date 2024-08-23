import db from "../db.server";
import {json} from '@remix-run/node'

let banners;
export async function loader({request}) {
    console.log("in mapping request ", request);
    console.log("request.headers ", request.headers);

    const shopUrl = request.headers.get('Origin');
    console.log("shopUrl ",shopUrl);
    if(shopUrl)
    {
        const shop = shopUrl.split('://')[1];
        console.log("storeName ", shop) 
        banners = await db.banner.findMany({
            where: { shop },
          });
        console.log("HELLO banners ", banners)
    } 
    return json({
        data: banners 
    }, 
    {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Headers": "*",
      },
    })
}