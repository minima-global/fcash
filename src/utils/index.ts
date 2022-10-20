

const numberWithCommas = (x: string) => {
  try {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } catch (err) {
    console.error(err)
    return x;

  }
}

function copy(text: string) {
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      const result = document.execCommand('copy');
      document.body.removeChild(input);
      if (!result) {
        throw new Error("Copy to clipboard failed.")
      }
      resolve(result);
    } catch (err: any) {
  
      reject(err);
    }
  });  
}

const containsText = (text: string, searchText: string) =>
    text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export {numberWithCommas, copy, containsText};