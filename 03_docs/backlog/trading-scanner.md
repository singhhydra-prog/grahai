# Skill: trading-scanner (FUTURE — NOT YET BUILT)

## Trigger
Use this skill when the user wants to work on the NSE gap-reversal trading scanner feature.

## Status: PLANNED — Not implemented yet

## Overview (from Design Doc)
A TradingView + data/API + backend scheduler + Claude agent system for NSE gap-reversal opportunities.

## Core Logic
- Universe: All NSE cash stocks + main indices (NIFTY50, BANKNIFTY, FINNIFTY)
- Timeframe: Daily
- Indicators: 21-day EMA, RSI(10) on 21-EMA, Gap detector
- Bullish reversal: Gap-up + RSI(10 on EMA21) < 10
- Bearish reversal: Gap-down + RSI(10 on EMA21) > 90
- Exit: Close crosses 21-EMA

## Planned Architecture
1. **Data**: TrueData Market Data API for EOD + pre-open scanning
2. **Scanner**: Python cron at 09:10, 09:20, 15:20 IST
3. **State**: Postgres (symbols, signals, positions tables)
4. **Claude agent**: Receives JSON signals → ranks A/B-grade → generates summary
5. **Delivery**: Telegram bot, Slack webhook, Email (SendGrid/SES)
6. **Optional**: TradingView Pine Script alerts + webhooks

## Build Order (When Started)
1. Finalize + backtest logic in TradingView
2. Build Python scanner for NIFTY50 test list
3. Add storage + daily cron
4. Wire Telegram alerts directly (without Claude)
5. Add Claude workflow for ranking + summarization
6. Scale to full NSE universe
7. Optional: broker API for semi-auto execution

## NOT PART OF CURRENT SPRINT — Separate project consideration
