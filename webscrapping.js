const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const Excel = require("exceljs");
//npm install exceljs
//npm install puppeteer

const scrape = async () => {
    const url = "https://www.google.com";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Scraped Data");

    // XPath ifadeleri için döngü
    for (let i = 3; i <= 20; i++) {
        const xpaths = [
            `//*[@id="__next"]/section/div/div/div[${i}]/div/div[1]/span`,
            `//*[@id="__next"]/section/div/div/div[${i}]/div/div[2]/h6`,
            `//*[@id="__next"]/section/div/div/div[${i}]/div/div[2]/span`
        ];

        // Her XPath için page.evaluate() çağrısı yaparak elementleri çekme
        const rowData = [];
        for (const xpath of xpaths) {
            const data = await page.evaluate((xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return element ? element.textContent.trim() : null;
            }, xpath);
            rowData.push(data);
        }
        worksheet.addRow(rowData);
    }

    // Excel dosyasını oluşturma
    try {
        await workbook.xlsx.writeFile("scraped_data.xlsx");
        console.log("Veriler başarıyla Excel dosyasına yazıldı: scraped_data.xlsx");
    } catch (error) {
        console.error("Excel dosyasına yazdırma hatası:", error);
    }

    await browser.close();
};

scrape();
