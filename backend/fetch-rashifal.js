// fetch-rashifal.js
(async () => {
    try {
        let getRashifal;
        try {
            const scraper = await import("hamro-patro-scraper");
            getRashifal = scraper.getRashifal || scraper.default?.getRashifal;
        } catch (e) {
            const { createRequire } = await import("module");
            const require = createRequire(import.meta.url);
            const scraper = require("hamro-patro-scraper");
            getRashifal = scraper.getRashifal || scraper.default?.getRashifal;
        }

        if (typeof getRashifal !== "function") {
            throw new Error("getRashifal is not a function in hamro-patro-scraper");
        }

        const horoscope = await getRashifal("daily");
        console.log(JSON.stringify(horoscope));
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
})();
