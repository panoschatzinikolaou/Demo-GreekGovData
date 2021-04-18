// helper function to group by the returned dataset
const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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
        let url = 'https://www.data.gov.gr/api/v1/summary/admie_dailyenergybalanceanalysis';
        let headers = {
            "Authorization": "Token ddb4fda2f258715d40ce9e64192b90bc0e0285e0",
            "Content-Type": "application/javascript"
        };
        // we need to create an array of object to build our dataset
        // call public endopoint
        await axios.get(url, { params: data, headers: headers }).then(res => {
            let resultArray = res.data;
            let datasetArray = [];
            let labelsArr = [];
            for (let k = 0; k < resultArray.length; k++) {
                let dataset = {};
                let tempObj = resultArray[k];
                dataset.label = tempObj.label;
                dataset.borderColor = getRandomColor();
                dataset.borderWidth = 1;
                dataset.fill = false;
                let dataAr = tempObj.data;
                let data = dataAr.map(item => item.y);
                if (k == 0) {
                    labelsArr = dataAr.map(item => item.x);
                }
                dataset.data = data;
                datasetArray.push(dataset);
            }
            loadChart(labelsArr, datasetArray);
        }).catch(error => {
            alert('Error: ' + error)
        });

    } else {
        alert("Please you must fill both datepickers!");
        return false;
    }
}

// function which creates the chart using chart.js
function loadChart(labels, datasetArray) {
    labels = labels.map(item => item.split('T')[0]);
    // remove canvas to be reused for another drawing
    $("canvas#myChart").remove();
    $("div.chartreport").append('<canvas id="myChart" class="marginL" height="400" width="700"></canvas>');

    let ctx = document.getElementById('myChart').getContext('2d');

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasetArray
        },
        options: {
            scales: {
                yAxes: [{
                    beginAtZero: true
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            hour: "MMM D hA [(EET)]"
                        },
                        stepSize: {
                            unit: 'day',
                            stepSize: 5
                        }
                    }
                }]
            }
        }
    });
    return myChart;

}