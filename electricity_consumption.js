// helper function to group by the returned dataset
const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
}, {});

// Javascript function to make call to the public API of data.gov.gr
async function getGovData() {
    // retrieve date values
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();

    if (fromDate !== "" && toDate !== "") {
        // fromDate and toDate have format mm/dd/yyyy so we need to transform it to yyyy-mm-dd
        let arrayFrom = fromDate.split("/");
        let arrayTo = toDate.split("/");

        let data = {
            date_from: arrayFrom[2] + "-" + arrayFrom[0] + "-" + arrayFrom[1],
            date_to: arrayTo[2] + "-" + arrayTo[0] + "-" + arrayTo[1]
        };
        let url = 'https://data.gov.gr/api/v1/query/electricity_consumption';
        let headers = {
            "Authorization": "Token ddb4fda2f258715d40ce9e64192b90bc0e0285e0",
            "Content-Type": "application/javascript"
        };
        // call public endopoint
        await axios.get(url, { params: data, headers: headers }).then(res => {
            const groupByDate = groupBy('date');
            let resultArray = res.data;
            let groupByDateArray = groupByDate(resultArray);
            let labels = Object.keys(groupByDateArray);
            labels = labels.map(item => item.split('T')[0]);
            // manipulate data i.e. find overall consumption per date
            let data = [];
            for(let i=0; i<Object.values(groupByDateArray).length; i++) {
                data.push(Object.values(groupByDateArray)[i].map(item => item.energy_mwh).reduce((prev, next) => prev + next));
            }
            loadChart(labels,data);
        }).catch(error => {
            alert('Error: ' + error)
        });

    } else {
        alert("Please you must fill both datepickers!");
        return false;
    }
}

// function which creates the chart
function loadChart(labels,data) {
    // remove canvas to be reused for another drawing
    $("canvas#myChart").remove();
    $("div.chartreport").append('<canvas id="myChart" class="marginL" height="400" width="700"></canvas>');

    let ctx = document.getElementById('myChart').getContext('2d');
    
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Consumption',
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 4,
                fill: false
            }]
        },
        options: {
            scales: {
                yAxes: {
                    beginAtZero: true
                }
            }
        }
    });
    return myChart;
    
}