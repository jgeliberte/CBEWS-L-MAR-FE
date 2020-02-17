const Helpers = {

    // Main wrapper for Fetch API
    httpRequest: (url, method, payload, headers) => {
        // Configuration to accept json as a default
        const config = {
            method,
            headers: {
            "Content-Type": "application/json"
            }
        };

        // method = post and payload, add it to the fetch request
        if (method.toLowerCase() === "post" &&  payload || payload.length > 0) {
            config.body = JSON.stringify(payload);
        }

        // if custom headers need to be set for the specific request
        // override them here
        if (headers && typeof headers === "object" && Object.keys(headers).length > 0) {
            config.headers = headers;
        }

        return fetch(
            url,
            config
        ).then((response) => {
            // Check if the request is 200
            if (response.ok) {
                let data = response;
                // if the type is json return, interpret it as json
                if (response.headers.get("Content-Type").indexOf("application/json") > -1) {
                    data = response.json();
                }
                return data;
            }
            // if an errors, anything but 200 then reject with the actuall response
            return Promise.reject(response);
        });
    },

    downloadBlob: (blob, filename) => {
        // Create an object URL for the blob object
        const url = URL.createObjectURL(blob);
        
        // Create a new anchor element
        const a = document.createElement('a');
        
        // Set the href and download attributes for the anchor element
        // You can optionally set other attributes like `title`, etc
        // Especially, if the anchor element will be attached to the DOM
        a.href = url;
        a.download = filename || 'download';
        
        // Click handler that releases the object URL after the element has been clicked
        // This is required for one-off downloads of the blob content
        const clickHandler = () => {
            setTimeout(() => {
                URL.revokeObjectURL(url);
                // this.removeEventListener('click', clickHandler);
            }, 150);
        };
        
        // Add the click event listener on the anchor element
        // Comment out this line if you don't want a one-off download of the blob content
        a.addEventListener('click', clickHandler, false);
        
        // Programmatically trigger a click on the anchor element
        // Useful if you want the download to happen automatically
        // Without attaching the anchor element to the DOM
        // Comment out this line if you don't want an automatic download of the blob content
        a.click();
        
        // Return the anchor element
        // Useful if you want a reference to the element
        // in order to attach it to the DOM or use it in some other way
        return a;
    }
  };

  export default Helpers;