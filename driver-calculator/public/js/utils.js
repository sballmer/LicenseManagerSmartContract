/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} body the paramiters to add to the url
 */

function post(path, body) {
  const Http = new XMLHttpRequest();
  Http.open("POST", path);
  Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  Http.send(JSON.stringify(body));

  Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
  }
}