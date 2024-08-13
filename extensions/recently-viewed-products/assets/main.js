var productNameArr = [];

document.addEventListener('DOMContentLoaded', function () {
  // sessionStorage.clear();
  identifyProductfromReq();
});

async function fetchProduct(productName) {
  try {
    const response = await fetch(`/products/${productName}.js`);
    const product = await response.json();
    console.log('product ', product);
    return product;
  } catch {
    console.log('Error NIkhil');
  }
}


async function decodeJson() {
  try {
    // Make an HTTP GET request to the server-side endpoint
    const response = await fetch('https://lionfish-app-hrorj.ondigitalocean.app/app/mapping');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const obj = await response.json();
    console.log("obj ", obj)
    return obj.data;
  }
  catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
}

function findCurrentPage() {
  const currentPageUrl = removeParam(window.location.href);
  let currentPage = "";
  // Check if the URL contains a specific path or query parameter indicating the page
  if (currentPageUrl.urlWithoutParams.endsWith('/')) {
    currentPage = "Home"
  }
  else if (location.href.indexOf("products") != -1) {
    currentPage = "Product"
  }
  else if (location.href.indexOf("collection") != -1 || location.href.indexOf("collections") != -1) {
    currentPage = "Collection";
  } else if (location.href.indexOf("cart") != -1) {
    currentPage = "Cart"
  } else if (location.href.indexOf("search") != -1) {
    currentPage = "Search"
  } else {
    currentPage = "All"
  }

  return currentPage;
}

function removeParam(sourceURL) {
  // Create a new URL object
  const parsedUrl = new URL(sourceURL);
  const params = {};

  // Extract parameters
  parsedUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  parsedUrl.search = '';
  return {
    urlWithoutParams: parsedUrl.toString(),
    params: params
  }
}

function extractShopifyStoreName(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    return hostname;
  } catch (error) {
    throw new Error('Invalid URL');
  }
}

var reqProductArr = [];
function arrSort(orderArray, arrayToSort) {
  arrayToSort.sort((a, b) => {
    console.log('a ', a.title, ' b ', b.title);
    const indexA = orderArray.indexOf(a.handle);
    const indexB = orderArray.indexOf(b.handle);

    // If both elements are in orderArray, compare their indices
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one element is in orderArray, it should come first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither element is in orderArray, sort them alphabetically
    return 1;
  });
}

function identifyProductfromReq() {
  console.log("location.href.indexOf('products') ", location.href.indexOf("products"));
  if (sessionStorage.getItem('productNameArr')) {
    const myArrayString = sessionStorage.getItem('productNameArr');
    productNameArr = JSON.parse(myArrayString);
  }
  if (location.href.indexOf("products") != -1) {
    console.log("In product page")

    const currentPageUrl = removeParam(window.location.href);
    const parsedUrl = new URL(currentPageUrl.urlWithoutParams);

    const segments = parsedUrl.pathname.split('/');
    console.log("productNameArr ", productNameArr)
    const pro = segments.filter(segment => segment).pop();
    if (productNameArr && !productNameArr.includes(pro)) {
      if (productNameArr.length == 3) {
        productNameArr.pop();
      }
      productNameArr.unshift(pro);
    }
    sessionStorage.setItem('productNameArr', JSON.stringify(productNameArr));
  }

  const shopName = extractShopifyStoreName(window.location.href);
  console.log("shopName ", shopName);
  console.log('Variable already set. Value:', productNameArr);
  console.log("productNameArr ", productNameArr)
  const fetchPromises = [];

  if (productNameArr) {
    productNameArr.forEach(productName => {
      if (productName && productName != "undefined") {
        const fetchPromise = fetchProduct(productName).then(response => {
          reqProductArr.unshift(response);
        }).catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
        fetchPromises.push(fetchPromise);
      }
    })

    Promise.all(fetchPromises)
      .then(() => {
        return decodeJson()
      })
      .then(edges => {
        console.log("edges ", edges)
        arrSort(productNameArr, reqProductArr);
        add_banner(edges[edges.length - 1].displayPosition, edges[edges.length - 1].topValue, edges[edges.length - 1].leftValue, edges[edges.length - 1].shop, reqProductArr)
      }).catch(error => {
        console.error('Error fetching JSON in identifyProductfromReq:', error);
      });
  }
}
// productName, reqProduct.body_html, reqProduct.variants[0].price

const maxRetries = 3;

function fetchWithRetry(url, options, retries) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            if (retries > 0) {
                console.warn(`Retrying... ${retries} attempts left`);
                return fetchWithRetry(url, options, retries - 1);
            } else {
                throw error;
            }
        });
}

async function checkoutProduct(productVariantId) {
    let formData = {
        'items': [{
            'id': productVariantId,
            'quantity': 1
        }]
    };

    const clearCartOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const addCartOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };
    
    fetchWithRetry(window.Shopify.routes.root + 'cart/clear.js', clearCartOptions, maxRetries)
        .then(() => {
            return fetchWithRetry(window.Shopify.routes.root + 'cart/add.js', addCartOptions, maxRetries);
        })
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/checkout/?ref=occ';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function add_banner(displayPosition, top, left, shop, reqProductArr) {
  left += 10;
  console.log("reqProductArr ", reqProductArr)
  if (location.href.indexOf("cart") == -1 && productNameArr) {
    const headerTag = document.querySelectorAll('[class*="header"]')[0];
    console.log('Header Tag:', headerTag.clientHeight, headerTag.scrollHeight);

    // Create a new div element
    const parentDiv = document.createElement('div');
    parentDiv.classList.add("bb-container")

    for (let i = 0; i < reqProductArr.length; i++) {
      const childDiv = document.createElement('div');
      childDiv.classList.add("bb-inner-container");
      const newDiv = document.createElement('div');
      newDiv.className = "bb-banner"
      // Add some content to the new div
      newDiv.textContent = reqProductArr[i].title;
      const buttonDiv = document.createElement('div');
      const button = document.createElement('button');
      button.textContent = 'Buy Now';
      button.classList.add("bb-inner-button");
      const pro_var_id = reqProductArr[i].variants[0].id;
      button.addEventListener('click', () => { checkoutProduct(pro_var_id) });
      //  buttonDiv.classList.add("bb-inner-button");
      buttonDiv.appendChild(button);
      childDiv.appendChild(newDiv);
      const priceDiv = document.createElement('div');
      priceDiv.className = "bb-banner";
      priceDiv.textContent = (reqProductArr[i].price / 100).toFixed(2);
      newDiv.insertAdjacentElement('afterend', buttonDiv)
      newDiv.insertAdjacentElement('afterend', priceDiv)
      console.log("childDiv ", childDiv)
      parentDiv.appendChild(childDiv);
      if (i != reqProductArr.length - 1) {
        const lineDiv = document.createElement('div');
        const lineChildDiv = document.createElement('div');
        lineDiv.className = "bb-line";
        lineChildDiv.className = "bb-child-line";
        lineDiv.appendChild(lineChildDiv);
        parentDiv.appendChild(lineDiv);
      }
      else {
        childDiv.style.marginBottom = '0px';
      }
    }
    // Insert the new div at the top of the body
    if (headerTag) {
      var posTop = headerTag.clientHeight + parseInt(top, 10) + 5;
      if (displayPosition == "top-left") {
        parentDiv.style.top = posTop + "px";
        parentDiv.style.left = left + "px";
      }
      if (displayPosition == "top-right") {
        parentDiv.style.top = posTop + "px";
        parentDiv.style.right = '0px';
        if (left != '0') {
          parentDiv.style.left = left + "px";
        }
      }
      if (displayPosition == "bottom-left") {
        parentDiv.style.bottom = '0px';
        parentDiv.style.left = left + "px";
        if (top != '0') {
          parentDiv.style.top = posTop + "px";;
        }
      }
      if (displayPosition == "bottom-right") {
        parentDiv.style.bottom = '0px';
        parentDiv.style.right = '0px';
        if (top != '0') {
          parentDiv.style.top = posTop + "px";;
        }
        if (left != '0') {
          parentDiv.style.left = left + "px";
        }
      }
      headerTag.insertAdjacentElement('afterend', parentDiv);
    }
    else {
      parentDiv.style.top = top + "px";
      parentDiv.style.left = left + "px";
      document.insertBefore(document.firstChild, parentDiv)
    }
  }

}