// fetch-nepse.js
(async () => {
    try {
        let Nepse;
        try {
            const nepseModule = await import("@rumess/nepse-api");
            Nepse = nepseModule.Nepse || nepseModule.default?.Nepse;
        } catch (e) {
            const { createRequire } = await import("module");
            const require = createRequire(import.meta.url);
            const nepseModule = require("@rumess/nepse-api");
            Nepse = nepseModule.Nepse || nepseModule.default?.Nepse;
        }

        let getGoldPrices, getExchangeRates;
        try {
            const hpScraper = await import("hamro-patro-scraper");
            getGoldPrices = hpScraper.getGoldPrices || hpScraper.default?.getGoldPrices;
            getExchangeRates = hpScraper.getExchangeRates || hpScraper.default?.getExchangeRates;
        } catch (e) {
            // optional gold/forex
        }

        let nepseIndexData = null;
        let marketStatus = null;
        let marketSummary = null;

        if (Nepse) {
            const nepse = new Nepse();
            try {
                const indices = await nepse.getNepseIndex();
                if (Array.isArray(indices)) {
                    nepseIndexData = indices.find(i => i.index === 'NEPSE Index' || i.id === 58) || indices[0];
                }
            } catch (err) {
                // fallback handled
            }

            try {
                marketStatus = await nepse.getMarketStatus();
            } catch (err) {}

            try {
                marketSummary = await nepse.getMarketSummary();
            } catch (err) {}
        }

        let goldData = null;
        if (typeof getGoldPrices === "function") {
            try {
                goldData = await getGoldPrices();
            } catch (err) {}
        }

        let forexData = null;
        if (typeof getExchangeRates === "function") {
            try {
                forexData = await getExchangeRates();
            } catch (err) {}
        }

        // Format values
        let indexVal = "2,545.41";
        let changeVal = "-13.85";
        let percentVal = "-0.54%";
        if (nepseIndexData) {
            if (nepseIndexData.currentValue) {
                indexVal = Number(nepseIndexData.currentValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (nepseIndexData.close) {
                indexVal = Number(nepseIndexData.close).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            if (nepseIndexData.change !== undefined && nepseIndexData.change !== null) {
                const ch = Number(nepseIndexData.change);
                changeVal = (ch > 0 ? "+" : "") + ch.toFixed(2);
            }
            if (nepseIndexData.perChange !== undefined && nepseIndexData.perChange !== null) {
                const pc = Number(nepseIndexData.perChange);
                percentVal = (pc > 0 ? "+" : "") + pc.toFixed(2) + "%";
            }
        }

        let turnoverVal = "रु ४.०० अर्ब";
        if (marketSummary && marketSummary['Total Turnover Rs:']) {
            const num = Number(marketSummary['Total Turnover Rs:']);
            if (num >= 1000000000) {
                turnoverVal = "रु " + (num / 1000000000).toFixed(2) + " अर्ब";
            } else if (num >= 10000000) {
                turnoverVal = "रु " + (num / 10000000).toFixed(2) + " करोड";
            }
        }

        let goldVal = "रु ३,०५,८०० / तोला";
        if (goldData && Array.isArray(goldData.goldPrices) && goldData.goldPrices.length > 0) {
            const firstGold = goldData.goldPrices[0];
            if (firstGold && firstGold.price) {
                goldVal = firstGold.price.replace(/Rs\s*/i, 'रु ') + " / तोला";
            }
        }

        let forexUSDVal = "रु १५३.०१";
        if (forexData && Array.isArray(forexData.exchangeRates)) {
            const usd = forexData.exchangeRates.find(r => r.code === 'USD');
            if (usd && usd.sellRate) {
                forexUSDVal = "रु " + usd.sellRate;
            }
        }

        const payload = {
            index: indexVal,
            change: changeVal,
            percent: percentVal,
            turnover: turnoverVal,
            goldPrice: goldVal,
            forexUSD: forexUSDVal,
            status: marketStatus?.isOpen || "CLOSE",
            raw: {
                nepseIndex: nepseIndexData,
                status: marketStatus,
                summary: marketSummary,
                gold: goldData,
                forex: forexData
            }
        };

        console.log(JSON.stringify(payload));
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
})();
