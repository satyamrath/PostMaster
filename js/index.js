

// *Utility functions*
// 1. utility function to get DOM element from string
function getElementFromString(string){
    let div = document.createElement("div");
    div.innerHTML = string;
    return div.firstElementChild;
} 


// initialize no of parameters
let addParamsCount = 0;

const parametersBox = document.getElementById("parametersBox");
const jsonBox = document.getElementById("requestJsonBox");
// console.log(jsonBox);


// hide the parameters box initially
parametersBox.style.display = "none";


// if the user clicks on params box, hide the json box
const paramsRadio = document.getElementById("paramsRadio");
paramsRadio.addEventListener("click", () => {
    jsonBox.style.display = "none";
    parametersBox.style.display = "block";
});

// if the user clicks on json box, hide the params box
const jsonRadio = document.getElementById("jsonRadio");
jsonRadio.addEventListener("click", () => {
    parametersBox.style.display = "none";
    jsonBox.style.display = "block";
});

let addParam = document.getElementById("addParam");
// if the user clicks on + button, add more parameters
addParam.addEventListener("click", () => {
    let params = document.getElementById("params");
    addParamsCount++;
    let string = `
            <div class="form-row my-2">
                <label for="parameterKey${addParamsCount+1}" class="col-sm-2 col-form-label">Parameter${addParamsCount+1}</label>
                <div class="col-md-4">
                    <input type="text" class="form-control" id="parameterKey${addParamsCount+1}" placeholder="Enter Parameter ${addParamsCount+1} Key" />
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" id="parameterValue${addParamsCount+1}"
                        placeholder="Enter Parameter ${addParamsCount+1} Value" />
                </div>
                <button class="btn btn-primary deleteParam">-</button>
            </div>`;
    let paramElement = getElementFromString(string);
    params.appendChild(paramElement);
    // add an event listener to remove the parameter on clicking - button
    let deleteParam = document.getElementsByClassName("deleteParam");
    for(let item of deleteParam){
        item.addEventListener("click", (e) => {
            e.target.parentElement.remove(); 
        });
    }
});

let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
    // show please wait in the response box to request patience from the user
    // document.getElementById("responseJsonText").value = "Please wait... Fetching response...";
    document.getElementById("responsePrism").innerHTML = "Please wait... Fetching response...";

    // fetch all the values user has entered
    let url = document.getElementById("url").value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;


    // if user has used params option instead of json, collect all the parameters in an object
    if(contentType == 'params'){
        data = {};
        for(i = 0 ; i < addParamsCount + 1; i++){
            if(document.getElementById("parameterKey" +(i+1)) != undefined){
                let key = document.getElementById('parameterKey' + (i+1)).value;
                let value = document.getElementById('parameterValue' + (i+1)).value;
                data[key] = value;
            }
        }
        data = JSON.stringify(data);
    }else{
        data = document.getElementById("requestJsonText").value;
    }
    // print all the values in console for debugging
    console.log("url : ", url);
    console.log("requestType : ", requestType);
    console.log("contentType : ", contentType);
    console.log("data : ", data);

    // if the request type is get, invoke fetch api to create get request
    if(requestType == 'GET'){
        fetch(url, {
            method: "GET",  
        })
        .then(response => response.text())
        .then(text => {
            // document.getElementById("responseJsonText").value = text;
            document.getElementById("responsePrism").innerHTML = text;
            Prism.highlightAll();
        });
    }else{
        fetch(url, {
            method: "POST",
            body: data,
            headers: {
                "content-type": 'application/json; charset=UTF-8',  
            }
        })
        .then(response => response.text())
        .then(text => {
            // document.getElementById("responseJsonText").value = text;
            document.getElementById("responsePrism").innerHTML = text;
            Prism.highlightAll();
        });
    }
});