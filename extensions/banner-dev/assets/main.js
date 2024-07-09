document.addEventListener('DOMContentLoaded', function () {
  identifyProductfromReq();
  });

  async function decodeJson() {
    try {
      // Make an HTTP GET request to the server-side endpoint
      const response = await fetch('https://lionfish-app-hrorj.ondigitalocean.app/app/mapping');
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const obj = await response.json();
      console.log("obj ",obj)
      return obj.data;
    }
    catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return [];
    }
  }

  function identifyProductfromReq() {
    // Get the current page URL
  
    decodeJson().then(edges => {
      console.log("edges ",edges)
    //  for (let index = 0; index < edges.length; index++) {
        add_banner(edges[edges.length-1].bannerText)
     // }
    }).catch(error => {
      console.error('Error fetching JSON in identifyProductfromReq:', error);
    });
  }


function add_banner(bannerText)
{
            // Create a new div element
            const newDiv = document.createElement('div');
            newDiv.className = "bb-banner"
            // Add some content to the new div
            newDiv.textContent = bannerText;
            
            // Optionally add some styles to the new div
            newDiv.style.backgroundColor = '#e3fc02';
            newDiv.style.padding = '10px';
            newDiv.style.textAlign = 'center';
            newDiv.style.color = 'black'
            
            // Insert the new div at the top of the body
            document.body.insertBefore(newDiv, document.body.firstChild);
}

