# DEMO WEBSITE

This project depicts a simple way to retrieve data from gov.data.gr and plot them using **Chart.js** library. It has the same
behavior with the official data.gov.gr site but without using _React.js_ framework. The goal is to use simple libraries like _jQuery_ to
minimize the overhead and to keep it as simple as possible from a code perspective.

# ENDPOINTS SUPPORT

Each .js file accesses a specific endpoint and manipulates the returned data to visualize them in a Chart.

| JS FILE | CORRESPONDING ENDPOINT |
|---|---|
|electricity_consumption.js | _https://data.gov.gr/datasets/electricity_consumption/_|
|dailyenergybalanceanalysis.js | _https://data.gov.gr/datasets/admie_dailyenergybalanceanalysis/_|
|renewableEnergy.js | _https://data.gov.gr/datasets/admie_realtimescadares/_|

# HOW TO USE
When webpage opens, the two datepickers have a default value of current date, and an automatic call to the endpoint is sent. The user can change these values. 
One should change the external js file referenced in the index.html to hit the appropriate endpoints.