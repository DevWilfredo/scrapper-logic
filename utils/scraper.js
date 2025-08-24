const puppeteer = require('puppeteer');
require("dotenv").config()

const scraper = async () => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        headless:true,
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });
    try {
        const page = await browser.newPage();
        await page.goto("https://news.ycombinator.com");

        const data = await page.evaluate(() => {
            const getNumber = (str) => {
                if (!str) return 0;
                const match = str.match(/\d+/);
                return match ? parseInt(match[0], 10) : 0;
            };

            const items = Array.from(document.querySelectorAll('.athing')).map(element => {
                const title = element.querySelector('.titleline > a');
                const rank = element.querySelector('.rank');
                const subtext = element.nextElementSibling.querySelector('.subtext');
                const score = subtext?.querySelector('.score');
                const comments = subtext?.querySelector('a:last-of-type');

                return {
                    rank: rank?.textContent || null,
                    title: title?.textContent || null,
                    score: getNumber(score?.textContent),
                    comments: getNumber(comments?.textContent)
                };
            });
            return items;
        });

        return data;
    } catch (error) {
        console.error("Error during scraping:", error);
        throw error;
    } finally {
        await browser.close();
    }
};

module.exports = scraper;
