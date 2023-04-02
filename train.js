import { createChart, updateChart } from "./scatterplot.js";
const nn = ml5.neuralNetwork({ task: "regression", debug: true });
let button = document.getElementById("btn");
let result = document.getElementById("result");

function loadData() {
    Papa.parse("./data/cars.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => checkData(results.data),
    });
}

function checkData(data) {
    // shuffle
    data.sort(() => Math.random() - 0.5);

    // split in train en test data
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // kijk hoe de data eruit ziet
    console.table(data);

    // een voor een de data toevoegen aan het neural network
    for (let car of trainData) {
        nn.addData({ horsepower: car.horsepower, displacement: car.displacement, weight: car.weight, acceleration: car.acceleration}, { mpg: car.mpg });
    }

    // normalize
    nn.normalizeData();

    // x = horsepower, displacement, weight, acceleration, y = mpg
    const chartdata = data.map((car) => ({
        x: car.horsepower,
        x: car.displacement,
        x: car.weight,
        x: car.acceleration,
        y: car.mpg,
    }));

    // kijk hoe de data eruit ziet
    // console.log(chartdata);

    // chartjs aanmaken
    createChart(chartdata, "Horsepower", "MPG");

    // start training
    startTraining();

    button.addEventListener("click", () => {
        let horsepower = parseInt(document.getElementById("horsepower").value);
        let displacement = parseInt(document.getElementById("displacement").value);
        let weight = parseInt(document.getElementById("weight").value);
        let acceleration = parseInt(document.getElementById("acceleration").value);
        makePrediction(horsepower, displacement, weight, acceleration);
    });

    // voorspelling maken
    makePrediction();

    // update de chart met nieuwe data
    updateChart();
}

// loadData();

function startTraining() {
    nn.train({ epochs: 10 }, () => finishedTraining());
}

async function finishedTraining() {
    let predictions = []
    for (let hp = 40; hp < 250; hp += 2) {
        const pred = await nn.predict({horsepower: hp})
        predictions.push({x: hp, y: pred[0].mpg})
    }
    updateChart("Predictions", predictions)

    nn.save()
}

async function makePrediction(displacement, weight, acceleration) {
    const results = await nn.predict({ horsepower: horsepower, displacement: displacement , weight: weight, acceleration: acceleration });
    result.innerHTML = `Geschat verbruik: ${results[0].price}`;
}

// async function makePrediction() {
//     const results = await nn.predict({ horsepower: 90 });
//     console.log(`Geschat verbruik: ${results[0].mpg}`);
// }

//
// demo data
//
// const data = [
//         { horsepower: 130, mpg: 18 },
//         { horsepower: 165, mpg: 15 },
//         { horsepower: 225, mpg: 14 },
//         { horsepower: 97, mpg: 18 },
//         { horsepower: 88, mpg: 27 },
//         { horsepower: 193, mpg: 9 },
//         { horsepower: 80, mpg: 25 },
// ]

loadData();