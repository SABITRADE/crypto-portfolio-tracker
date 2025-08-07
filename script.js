// script.js

const API_URL = 'https://api.coingecko.com/api/v3'; const cryptoData = document.getElementById('crypto-data'); const searchInput = document.getElementById('search');

let allCoins = []; let displayedCoins = [];

// Fetch top 100 coins initially async function fetchTopCoins() { try { const res = await fetch(${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false); const data = await res.json(); displayedCoins = data; renderTable(data); } catch (error) { console.error('Error fetching top coins:', error); } }

// Fetch all coins list for search reference async function fetchAllCoins() { try { const res = await fetch(${API_URL}/coins/list); const data = await res.json(); allCoins = data; } catch (error) { console.error('Error fetching coin list:', error); } }

// Search functionality searchInput.addEventListener('input', async (e) => { const query = e.target.value.toLowerCase(); if (!query) { renderTable(displayedCoins); return; }

const matchedCoin = allCoins.find( coin => coin.name.toLowerCase() === query || coin.symbol.toLowerCase() === query || coin.id.toLowerCase() === query );

if (matchedCoin) { try { const res = await fetch(${API_URL}/coins/markets?vs_currency=usd&ids=${matchedCoin.id}); const data = await res.json(); renderTable(data); } catch (error) { console.error('Error fetching coin details:', error); } } else { renderTable([]); } });

// Render table rows function renderTable(coins) { cryptoData.innerHTML = '';

if (coins.length === 0) { cryptoData.innerHTML = '<tr><td colspan="4">No coins found</td></tr>'; return; }

coins.forEach(coin => { const changeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'; const row = <tr> <td>${coin.name}</td> <td>$${coin.current_price.toLocaleString()}</td> <td class="${changeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</td> <td>$${coin.market_cap.toLocaleString()}</td> </tr>; cryptoData.innerHTML += row; }); }

// Refresh prices periodically setInterval(fetchTopCoins, 15000);

// Initialize fetchTopCoins(); fetchAllCoins();


