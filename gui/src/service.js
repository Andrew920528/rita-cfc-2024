/**
 * Functions that calls our backend
 */

const BASE_URL_DEV = "http://127.0.0.1:5000";
export async function tryTrySee() {
  const apiName = "tryTrySee";
  console.log(
    `Request | ${apiName} | ${new Date().toTimeString().split(" ")[0]}`
  );
  try {
    const response = await fetch(BASE_URL_DEV + "/hello", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    console.log(
      `Response | ${apiName} | ${new Date().toTimeString().split(" ")[0]}`,
      data
    );
    return data;
  } catch (error) {
    console.log(`Error | ${apiName} `, error);
  }
}
