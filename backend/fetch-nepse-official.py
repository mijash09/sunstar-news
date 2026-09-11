#!/usr/bin/env python3
import sys
import os
import json

# Ensure local NepseUnofficialApi is loadable if needed
script_dir = os.path.dirname(os.path.abspath(__file__))
nepse_api_dir = os.path.join(script_dir, 'nepse_api')
if os.path.exists(nepse_api_dir) and nepse_api_dir not in sys.path:
    sys.path.insert(0, nepse_api_dir)

def format_turnover_nepali(val):
    try:
        f = float(val)
        arba = f / 1000000000.0
        return f"रु {arba:.2f} अर्ब"
    except Exception:
        return "रु ४.०० अर्ब"

def format_change(val, is_pct=False):
    try:
        f = float(val)
        prefix = "+" if f > 0 else ""
        formatted = f"{prefix}{f:.2f}"
        return f"{formatted}%" if is_pct else formatted
    except Exception:
        return "+0.00%" if is_pct else "+0.00"

def run():
    try:
        from nepse import Nepse
        nepse = Nepse()
        nepse.setTLSVerification(False)

        status_info = nepse.getMarketStatus() or {}
        is_open_str = str(status_info.get('isOpen', 'CLOSE')).upper()
        is_market_open = (is_open_str == 'OPEN')

        # Indices
        indices = nepse.getNepseIndex() or []
        nepse_idx_val = "2,531.55"
        nepse_change_val = "-13.85"
        nepse_pct_val = "-0.54%"
        for item in indices:
            name = item.get('index')
            if name == 'NEPSE Index':
                cur = item.get('currentValue')
                chg = item.get('change')
                pct = item.get('perChange')
                if cur is not None:
                    nepse_idx_val = f"{float(cur):,.2f}"
                if chg is not None:
                    nepse_change_val = format_change(chg, False)
                if pct is not None:
                    nepse_pct_val = format_change(pct, True)
                break

        # Summary / Turnover
        summary_items = nepse.getSummary() or []
        turnover_str = "रु ४.०० अर्ब"
        for s in summary_items:
            detail = str(s.get('detail', ''))
            if 'Total Turnover' in detail:
                turnover_str = format_turnover_nepali(s.get('value', 0))
                break

        # Live Stocks or Top Gainers / Turnover scrips
        raw_stocks = []
        if is_market_open:
            try:
                raw_stocks = nepse.getLiveMarket() or []
            except Exception:
                raw_stocks = []

        if not raw_stocks:
            try:
                raw_stocks = nepse.getTopGainers() or []
            except Exception:
                raw_stocks = []

        formatted_stocks = []
        for item in raw_stocks[:25]:
            symbol = item.get('symbol') or item.get('ticker') or ''
            name = item.get('securityName') or item.get('name') or symbol
            ltp = item.get('ltp') or item.get('closingPrice') or item.get('lastTradedPrice') or 0
            chg = item.get('pointChange') or item.get('change') or 0
            pct = item.get('percentageChange') or item.get('perChange') or 0
            is_up = float(chg) >= 0

            formatted_stocks.append({
                'name': name,
                'symbol': symbol,
                'price': f"{float(ltp):,.2f}",
                'changePercent': format_change(pct, True),
                'changePoint': format_change(chg, False),
                'isUp': is_up,
                'securityId': item.get('securityId'),
            })

        output = {
            'success': True,
            'source': 'NEPSE Official Exchange API (NepalStock.com)',
            'index': nepse_idx_val,
            'change': nepse_change_val,
            'percent': nepse_pct_val,
            'turnover': turnover_str,
            'goldPrice': 'रु ३,०५,८०० / तोला',
            'forexUSD': 'रु १५३.०१',
            'isMarketOpen': is_market_open,
            'status': is_open_str,
            'asOf': status_info.get('asOf'),
            'stocks': formatted_stocks,
            'indices': indices,
            'summary': summary_items,
        }
        print(json.dumps(output))

    except Exception as e:
        fallback = {
            'success': False,
            'error': str(e),
            'source': 'Sunstar NEPSE Fallback Engine',
            'index': '2,531.55',
            'change': '-13.85',
            'percent': '-0.54%',
            'turnover': 'रु ४.०० अर्ब',
            'goldPrice': 'रु ३,०५,८०० / तोला',
            'forexUSD': 'रु १५३.०१',
            'isMarketOpen': False,
            'stocks': [
                {'name': 'Liberty Energy Company Limited', 'symbol': 'LEC', 'price': '246.10', 'changePercent': '+15.00%', 'changePoint': '+32.10', 'isUp': True},
                {'name': 'Dolti Power Company Limited', 'symbol': 'DOLTI', 'price': '299.00', 'changePercent': '+8.22%', 'changePoint': '+22.70', 'isUp': True},
                {'name': 'Makar Jitumaya Suri Hydropower', 'symbol': 'MAKAR', 'price': '400.00', 'changePercent': '+0.00%', 'changePoint': '+0.00', 'isUp': True},
            ],
        }
        print(json.dumps(fallback))

if __name__ == '__main__':
    run()
