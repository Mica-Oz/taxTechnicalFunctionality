const axios = require("axios");
const cheerio = require("cheerio");

//scrape response data from
//https://www.irs.gov/efile-index-taxpayer-search?zip=90021&state=6
//and be able to sort by name or phone

//this array is to map an index to a state so that
const states = [
  //null at index 0 makes states' 'number' correspond to index
  null,
  "Any",
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

//this will always be sorted alphabetically bc the response is always returned
//from the IRS alphabetically
const preparers = [];

//write a function that takes in state name and zip code and returns HTML response data
//these args will be passed by a handleSumbit function
async function getHTML(state, zip) {
  let stateNum = states.indexOf(state);

  try {
    const response = await axios.get(
      `https://www.irs.gov/efile-index-taxpayer-search?zip=${zip}&state=${stateNum}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching tax preparers:", error);
    return null;
  }
}

//sort by either phone or name --  expecting param from submission form
const sortedPrep = [];

function sortByEither(wayToSort) {
  if (wayToSort === "phone") {
    console.log("hit");

    preparers.sort();
  } else {
  }

  console.log("line91", preparers);
  for (let i = 0; i < preparers.length; i++) {
    sortedPrep.push(preparers[i][1]);
  }
  //   console.log("line102", sortedPrep);
  return sortedPrep;
}

//call function then parse with cheerio
//this function would be called and passed args from the handleSubmit function
getHTML("California", 90210)
  .then((res) => {
    const $ = cheerio.load(res);
    $("tbody>tr").each((i, preparer) => {
      let item = $(preparer)
        .find("td.views-field.views-field-nothing-1")
        .text();
      //   .html()
      //   .trim()
      //   .split("<br>");
      //phone is just the number value of the phone number for sorting
      let phone = $(preparer)
        .find("td.views-field.views-field-nothing-1 a")
        .text()
        .replace(/\s/g, "")
        .replace("(", "")
        .replace(")", "")
        .replace("-", "");

      preparers.push([phone, item]);
      // console.log(item, phone);
    });
  })
  .then((res) => {
    //this would be passed arg from handleSubmit
    sortByEither("name");
    console.log("line 131", sortedPrep);
  });
