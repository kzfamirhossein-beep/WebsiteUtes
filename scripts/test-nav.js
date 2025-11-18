const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto("http://localhost:3010", { waitUntil: "networkidle" });
    await page.waitForSelector("header nav", { state: "visible", timeout: 5000 });
    await page.click('text="محصولات"');
    await page.waitForURL("**/products", { timeout: 5000 });
    console.log("Navigated to:", page.url());
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

