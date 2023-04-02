const predictButton = document.getElementById("btn"); 
const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded())

let result = document.getElementById("result")

function modelLoaded() {
    predictButton.addEventListener("click", () => {
        let displacement = parseInt(document.getElementById("displacement").value)
        let weight = parseInt(document.getElementById("weight").value)
        let acceleration = parseInt(document.getElementById("acceleration").value)
        makePrediction(displacement, weight, acceleration)
    

    })
}

async function makePrediction(displacement, weight, acceleration) {
    const pred = await nn.predict({ displacement: displacement, weight: weight, acceleration: acceleration})
    result.innerHTML = `Price is ${pred[0].price}`
}