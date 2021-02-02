import * as tf from '@tensorflow/tfjs';

import { sayHello } from "./greet"

function showHello(divDocumentID: string, name: string) {
	const divElement = document.getElementById(divDocumentID);
	divElement.innerText = sayHello(name);
}

const model = tf.loadLayersModel("./model/model.json")
	.then((result: any) => {
		console.log(result);
	})
	.catch((exception: Error) => {
		console.error(exception);
	});

showHello("greeting", "TensorFlowJS");
