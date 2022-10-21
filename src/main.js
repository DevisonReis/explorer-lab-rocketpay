import "./css/index.css"

import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type){
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", 'cc-' + type + '.svg');
}

setCardType("mastercard");

let ccSecurity = document.getElementById("security-code");
let ccSecurityMask = {
  mask: '000'
};

let ccSecurityMasked = IMask(ccSecurity, ccSecurityMask);

let cvv = document.querySelector(".cc-security .value");
cvv.addEventListener('input', () => {

})

let ccExpirationDate = document.getElementById("expiration-date");
let data = new Date;

let ccExpirationDateMask = {
  mask: 'MM{/}YY',
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 6).slice(2)
    }
  }
}

let ccExpirationDateMasked = IMask(ccExpirationDate, ccExpirationDateMask);

const cardNumber = document.getElementById("card-number");
const cardNumberMask = {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardtype: 'visa',
    },

    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: 'mastercard',
    },

    {
      mask: '0000 0000 0000 0000',
      cardtype: 'default',
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, '');
    const foundMask = dynamicMasked.compiledMasks.find(function(item) {
      return number.match(item.regex)
    })
    
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberMask);


const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerText = cardHolder.value.length === 0 ? 'SEU NOME AQUI' : cardHolder.value
})

// Atualiza o cvv do cartão com os valores do input
ccSecurityMasked.on('accept', () => {
  updateSecurityCode(ccSecurityMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = code.length === 0 ? '123' : code
}

// Atualiza o cartão com o numero digitado no input
cardNumberMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector('.cc-number')
  ccNumber.innerText = number.length === 0 ? '1234 5678 9123 456' : number
}

// Atualiza o cartão com a data de expiração do input
ccExpirationDateMasked.on('accept', () => {
  updateEspirationDate(ccExpirationDateMasked.value)
})

function updateEspirationDate(date) {
  const ccExpiration = document.querySelector('.cc-extra .value')
  ccExpiration.innerText = date.length === 0 ? '01/28' : date
}