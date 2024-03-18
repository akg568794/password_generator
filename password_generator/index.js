

const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const numberCheck=document.querySelector("#numbers")
const symbolsCheck=document.querySelector("#symbols")
const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generateButton")
const allCheckBox=document.querySelectorAll("input[type=checkbox]")


// initial values 

 let password=""
 let passwordLength=10;
 let checkCount=0;
 handleSlider();
 setIndicator("#ccc");
    

function handleSlider(){
    inputSlider.value=passwordLength;
    // passwordLength=inputSlider.value;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+ "% 100%";
}  

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()* (max-min)) +min;
}

function generateRandomNumber(){
    return getRandomInteger(0,10);

}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123))
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91))
}

function getRandomSymbol(){
    const symbols=["!","@","#","$","%","^","&","*","(",")","_","+","="]
    return symbols[getRandomInteger(0,symbols.length-1)]
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNumber = true;
    if (symbols.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyPassword() {
    try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "Copied";
    } catch (err) {
      copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
      copyMsg.classList.remove("active");
    }, 2000);
  }

function shufflePasword(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();

    }
}

allCheckBox.forEach ((checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',(e)=>{
    if(passwordDisplay.value){
        copyPassword();
    }
})

generateBtn.addEventListener('click',(  )=>{
   if(checkCount<=0){
    return;
   }
   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
   }

   // finding new password
   password="";
   let arr=[];
   if(uppercaseCheck.checked){
    arr.push(generateUpperCase);
   }
   if(lowercaseCheck.checked){
    arr.push(generateLowerCase);
   }
   if(numberCheck.checked){
    arr.push(generateRandomNumber);
   }
   if(symbolsCheck.checked){
    arr.push(getRandomSymbol);
   }
   //compoulsory addition 
   for(let i=0;i<arr.length;i++){
    password+=arr[i]();
   }

   // remaining addtion
   for(let i=0;i<passwordLength-arr.length;i++){
    let randomIndex=getRandomInteger(0,arr.length);
    password+=arr[randomIndex]();
   }
   // shuffle password
   password=shufflePasword(Array.from(password));
   // show password in ui
   passwordDisplay.value=password;
   // calculate strength
   calcStrength();
});