require("dotenv").config();

const nightmare = require("nightmare")();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.AMAZON_API);

const args = process.argv.slice(2);
const url = args[0];
const price = args[1];

checkPrice();

async function checkPrice() {
  const priceString = await nightmare
    .goto(url)
    .wait("#priceblock_ourprice")
    .evaluate(() => document.querySelector("#priceblock_ourprice").innerText)
    .end();
  const priceNumber = parseFloat(
    priceString.replace("€", "").replace(",", ".")
  );
  if (priceNumber <= price) {
    const msg = {
      to: "giulio.poggia@gmail.com",
      from: "g.poggia@net-informatica.it",
      subject: "Amazon Price Checker",
      text: `Price is low. Buy this now:${url}`,
      html: `Price is low. Buy this now:${url}`,
    };
    sgMail.send(msg).then(
      () => {},
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
  } else {
    console.log("price is too high atm: " + priceNumber);
  }
}
