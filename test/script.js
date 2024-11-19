const jsonUrl = 'data.json/final_ecosystem.json';

let ecosystemsData = []; // To store JSON data globally

// Fetch JSON data and render content
async function loadEcosystems() {
  try {
    const response = await fetch(jsonUrl);
    const data = await response.json();
    ecosystemsData = data.ecosystems;

    populateFilter(data.ecosystems); // Populate filter dropdown
    renderEcosystems('all'); // Render all ecosystems initially
  } catch (error) {
    console.error('Error loading ecosystems:', error);
  }
}

// Populate the filter dropdown
function populateFilter(ecosystems) {
  const filter = document.getElementById('ecosystem-filter');
  ecosystems.forEach((ecosystem, index) => {
    const option = document.createElement('option');
    option.value = index; // Use index to identify ecosystems
    option.textContent = ecosystem.name;
    filter.appendChild(option);
  });

  // Add change event listener to filter dropdown
  filter.addEventListener('change', (event) => {
    const selectedEcosystem = event.target.value;
    renderEcosystems(selectedEcosystem);
  });
}

// Render ecosystems based on the selected filter
function renderEcosystems(filterValue) {
  const container = document.getElementById('ecosystem-container');
  container.innerHTML = ''; // Clear previous content

  const filteredEcosystems = 
    filterValue === 'all' 
      ? ecosystemsData 
      : [ecosystemsData[filterValue]];

  filteredEcosystems.forEach(ecosystem => {
    // Create ecosystem section
    const ecosystemDiv = document.createElement('div');
    ecosystemDiv.classList.add('ecosystem');

    // Add ecosystem name
    const ecosystemTitle = document.createElement('h2');
    ecosystemTitle.textContent = ecosystem.name;
    ecosystemDiv.appendChild(ecosystemTitle);

    // Add tokens for this ecosystem
    ecosystem.tokens.forEach(token => {
      const tokenCard = document.createElement('div');
      tokenCard.classList.add('token-card');

      // Token icon and name
      const tokenHeader = document.createElement('div');
      const tokenIcon = document.createElement('img');
      tokenIcon.src = token.logo;
      tokenIcon.alt = `${token.name} Logo`;

      const tokenName = document.createElement('h3');
      tokenName.textContent = `${token.name} (${token.ticker})`;

      tokenHeader.appendChild(tokenIcon);
      tokenHeader.appendChild(tokenName);

      tokenCard.appendChild(tokenHeader);

      // Token details
      const tokenDetails = document.createElement('div');
      tokenDetails.classList.add('token-details');
      tokenDetails.innerHTML = `
        <p><strong>Contract:</strong> ${token.contract_address}</p>
        <p><strong>Supply:</strong> ${token.supply}</p>
        <p><strong>Buy Tax:</strong> ${token.buy_tax}%</p>
        <p><strong>Sell Tax:</strong> ${token.sell_tax}%</p>
        <p>${token.description}</p>
      `;
      tokenCard.appendChild(tokenDetails);

      // Token actions (charts)
      const tokenActions = document.createElement('div');
      tokenActions.classList.add('token-actions');
      token.chart.forEach(link => {
        const chartLink = document.createElement('a');
        chartLink.href = link;
        chartLink.textContent = 'View Chart';
        chartLink.target = '_blank';
        tokenActions.appendChild(chartLink);
      });
      tokenCard.appendChild(tokenActions);

      // Append token card to ecosystem
      ecosystemDiv.appendChild(tokenCard);
    });

    // Append ecosystem section to container
    container.appendChild(ecosystemDiv);
  });
}

// Load ecosystems on page load
document.addEventListener('DOMContentLoaded', loadEcosystems);
