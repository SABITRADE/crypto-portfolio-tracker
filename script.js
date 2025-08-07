<script>
  let allCoins = []; // store all fetched coins
  const searchInput = document.getElementById("search");
  const tableBody = document.getElementById("crypto-table");
  const notFoundText = document.getElementById("not-found");

  // Load top 100 on dashboard
  async function loadTopCoins() {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1`);
    const data = await res.json();
    allCoins = data; // store top 100 for display
    displayCoins(data);
  }

  // Fetch up to 5000 coins for search only (background)
  async function preloadAllCoins() {
    let fullList = [];
    for (let page = 1; page <= 20; page++) {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=${page}`);
      const data = await res.json();
      fullList = fullList.concat(data);
    }
    allCoins = fullList;
  }

  // Show coins in the table
  function displayCoins(coins) {
    tableBody.innerHTML = "";
    notFoundText.style.display = "none";

    if (!coins.length) {
      notFoundText.style.display = "block";
      return;
    }

    coins.forEach(coin => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'lightgreen' : 'salmon'};">
          ${coin.price_change_percentage_24h?.toFixed(2) ?? "0.00"}%
        </td>
        <td>$${coin.market_cap.toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Handle search input
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase().trim();

    if (!term) {
      loadTopCoins(); // show top 100 again
      return;
    }

    const results = allCoins.filter(coin =>
      coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term)
    );

    displayCoins(results);
  });

  // Refresh top 100 coins every 60 seconds if not searching
  setInterval(() => {
    if (!searchInput.value.trim()) {
      loadTopCoins();
    }
  }, 60000); // 60,000 ms = 60 seconds

  // Init
  loadTopCoins();
  preloadAllCoins(); // preload in background for search
</script>
