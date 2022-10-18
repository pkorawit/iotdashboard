const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

// This sample should be run in tandem with the aedes_server.js file.
// Simply run it:
// $ node aedes_server.js
//
// Then run this file in a separate console:
// $ node websocket_sample.js
//
const host = "ws://broker.hivemq.com:8000/mqtt";
let tempArray = []
let humidArray = []
currentTemp = 0.0
currentHumid = 0.0
const options = {
    keepalive: 30,
    clientId: clientId
};

console.log("connecting mqtt client");
const client = mqtt.connect(host, options);

client.on("error", function (err) {
    console.log(err);
    client.end();
});

client.on("connect", function () {
    console.log("client connected:" + clientId);
    client.subscribe("/manalab/dht22/", { qos: 0 });
});

client.on("message", function (topic, message, packet) {
    console.log(
        "Received Message:= " + message.toString() + "\nOn topic:= " + topic
    );
    payload = {
        humid: message.toString().split(',')[0],
        temp: message.toString().split(',')[1]
    }
    updateUI(payload)
    currentTemp = payload.temp
    currentHumid = payload.humid

});

client.on("close", function () {
    console.log(clientId + " disconnected");
});

function updateUI(model) {
    document.getElementById("humid").innerHTML = model.humid
    document.getElementById("temp").innerHTML = model.temp
}

var chart_options = {
    series: [{
        name: "Temp",
        data: []
      },{
        name: "Humid",
        data: []
      }],
    chart: {
        id: 'realtime',
        height: 350,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Weather Station',
        align: 'left'
    },
    markers: {
        size: 0
    },
    xaxis: {
        type: 'time'
    },
    yaxis: {
        min: 0,
        max: 100
    },
    legend: {
        show: false
    },
};

var chart = new ApexCharts(document.querySelector("#chart"), chart_options);
chart.render();

window.setInterval(() => {
    tempArray.push(currentTemp)
    humidArray.push(currentHumid)
    if(tempArray.length > 10) tempArray = tempArray.slice(1);
    if(humidArray.length > 10) humidArray = humidArray.slice(1);
    console.log("🚀 ~ tempArray", tempArray)
    console.log("🚀 ~ humidArray", humidArray)
    chart.updateSeries([{
        data: tempArray
    },
    {
        data: humidArray
    }])
}, 1000)