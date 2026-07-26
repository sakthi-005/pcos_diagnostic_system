document.addEventListener('DOMContentLoaded', function () {

    const historyBody = document.getElementById('historyBody');
    const searchInput = document.getElementById('searchInput');
    const riskFilter = document.getElementById('riskFilter');

    let allRecords = [];
    fetch('/api/history')
        .then(response => response.json())
        .then(data => {
            allRecords = data;
            renderRows(allRecords);
        })
        .catch(function (error) {
            console.error('Failed to load history:', error);
            historyBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Could not load history.</td></tr>';
        });
    function renderRows(records) {
        if (records.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No records found.</td></tr>';
            return;
        }

        historyBody.innerHTML = records.map(function (r) {
            const date = new Date(r.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const riskClass = r.prediction === 1 ? 'risk-badge-high' : 'risk-badge-low';
            return `
                <tr>
                    <td class="data-font">${r.patient_id}</td>
                    <td>${date}</td>
                    <td class="data-font">${r.bmi.toFixed(1)}</td>
                    <td><span class="risk-badge ${riskClass}">${r.risk_label}</span></td>
                    <td class="data-font">${r.confidence}%</td>
                </tr>
            `;
        }).join('');
    }
    function applyFilters() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const riskValue = riskFilter.value;

        let filtered = allRecords;

        if (searchTerm) {
            filtered = filtered.filter(r => r.patient_id.toLowerCase().includes(searchTerm));
        }
        if (riskValue !== 'all') {
            filtered = filtered.filter(r => String(r.prediction) === riskValue);
        }

        renderRows(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    riskFilter.addEventListener('change', applyFilters);

});