// THIS FILE PROVIDE COMMON FUNCTIONALITIES
const tracelog = '1';

/**
 * This method is console log handler
 * @param data
 * @param data2
 */
exports.consoleHandler = (data, data2) => {
  if(tracelog !== '0'){
    console.log(data);
    if(data2 !== undefined){
      console.log(data2);
    }
  }
}

/**
 * This method creates and returns the current date
 * Format: YYYY-MM-DD: HH:mm:ss
 * @param hoursAdd
 * @returns {string}
 */
exports.createCurrentDate = (hoursAdd) => {

  // Create a new Date
  const newDate = new Date();

  // If the optional parameter hoursAdd is specified
  if (this.checkUndefinedNull(hoursAdd)){
    newDate.setTime(newDate.getTime() + hoursAdd * 60 * 60 * 1000);
  }

  let strMonth = '';
  if ((newDate.getMonth() + 1) < 10){
    strMonth = '0' + (newDate.getMonth()+1).toString();
  } else {
    strMonth = (newDate.getMonth()+1).toString();
  }

  let strDate = '';
  if (newDate.getDate() < 10){
    strDate = '0' + newDate.getDate().toString();
  } else {
    strDate = newDate.getDate().toString();
  }

  let strHours = '';
  if (newDate.getHours() < 10){
    strHours = '0' + newDate.getHours().toString();
  } else {
    strHours = newDate.getHours().toString();
  }

  let strMinutes = '';
  if (newDate.getMinutes() < 10){
    strMinutes = '0' + newDate.getMinutes().toString();
  } else {
    strMinutes = newDate.getMinutes().toString();
  }

  let strSeconds = '';
  if (newDate.getSeconds() < 10){
    strSeconds = '0' + newDate.getSeconds().toString();
  } else {
    strSeconds = newDate.getSeconds().toString();
  }

  const newDateServerFormat = newDate.getFullYear() + "-" + strMonth + "-" + strDate + " " + strHours + ":" + strMinutes + ":" + strSeconds;
  return newDateServerFormat;
}

/**
 * This method creates and returns the current date
 * Format: YYYY-MM-DD: HH:mm:ss
 * @param minutesAdd
 * @returns {string}
 */
exports.createFutureDate = (minutesAdd) => {

  // Create a new Date
  const newDate = new Date();

  // If the optional parameter minutesAdd is specified
  if (this.checkUndefinedNull(minutesAdd)){
    newDate.setTime(newDate.getTime() + minutesAdd * 60 * 1000);
  }

  let strMonth = '';
  if ((newDate.getMonth() + 1) < 10){
    strMonth = '0' + (newDate.getMonth()+1).toString();
  } else {
    strMonth = (newDate.getMonth()+1).toString();
  }

  let strDate = '';
  if (newDate.getDate() < 10){
    strDate = '0' + newDate.getDate().toString();
  } else {
    strDate = newDate.getDate().toString();
  }

  let strHours = '';
  if (newDate.getHours() < 10){
    strHours = '0' + newDate.getHours().toString();
  } else {
    strHours = newDate.getHours().toString();
  }

  let strMinutes = '';
  if (newDate.getMinutes() < 10){
    strMinutes = '0' + newDate.getMinutes().toString();
  } else {
    strMinutes = newDate.getMinutes().toString();
  }

  let strSeconds = '';
  if (newDate.getSeconds() < 10){
    strSeconds = '0' + newDate.getSeconds().toString();
  } else {
    strSeconds = newDate.getSeconds().toString();
  }

  const newDateServerFormat = newDate.getFullYear() + "-" + strMonth + "-" + strDate + " " + strHours + ":" + strMinutes + ":" + strSeconds;
  return newDateServerFormat;
}

/**
 * This method checks if the given field in undefined or null
 * @param givenFieldChecked
 * @returns {boolean}
 */
exports.checkUndefinedNull = (givenFieldChecked) => {
  if (givenFieldChecked === undefined || givenFieldChecked === null){
    return false;
  }

  return true;
};

/**
 * This method checks if the given field in undefined or null or empty string
 * @param givenFieldChecked
 * @returns {boolean}
 */
exports.checkNecessaryCases = (givenFieldChecked) => {
  if (givenFieldChecked === undefined || givenFieldChecked === null || givenFieldChecked === ''){
    return false;
  }

  return true;
};