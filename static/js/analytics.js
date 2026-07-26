document.addEventListener('DOMContentLoaded', function () {

    const answersRaw = sessionStorage.getItem('pcosense_answers');
    const resultRaw = sessionStorage.getItem('pcosense_result');
    if (!answersRaw || !resultRaw) {
        window.location.href = '/assessment';
        return;
    }

    const answers = JSON.parse(answersRaw);
    const result = JSON.parse(resultRaw);
    const bmi = answers.weight / ((answers.height / 100) ** 2);
    const styles = getComputedStyle(document.documentElement);
    const bloom = styles.getPropertyValue('--bloom').trim();
    const iris = styles.getPropertyValue('--iris').trim();
    const mist = styles.getPropertyValue('--mist').trim();
    const ink = styles.getPropertyValue('--ink').trim();

    // ----------BMI Gauge----------
    const bmiMax = 40;
    const bmiClamped = Math.min(bmi, bmiMax);
    new Chart(document.getElementById('bmiGaugeChart'), {
        type: 'doughnut',
        data: {
            labels: ['Your BMI', 'Remaining'],
            datasets: [{
                data: [bmiClamped, bmiMax - bmiClamped],
                backgroundColor: [bloom, mist],
                borderWidth: 0
            }]
        },
        options: {
    circumference: 180,
    rotation: 270,
    cutout: '75%',
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
},
        plugins: [{
            id: 'centerText',
            afterDraw(chart) {
                const { ctx, chartArea } = chart;
                ctx.save();
                ctx.font = "600 28px 'IBM Plex Mono'";
                ctx.fillStyle = ink;
                ctx.textAlign = 'center';
               ctx.fillText(bmi.toFixed(1), (chartArea.left + chartArea.right) / 2, chartArea.bottom - 35);
                ctx.restore();
            }
        }]
    });

    // ----------Prediction Probability ----------
    const probPcos = result.prediction === 1 ? result.confidence : (100 - result.confidence);
    const probNoPcos = 100 - probPcos;
    new Chart(document.getElementById('probabilityChart'), {
        type: 'bar',
        data: {
            labels: ['PCOS Risk', 'No PCOS Risk'],
            datasets: [{
                data: [probPcos, probNoPcos],
                backgroundColor: [bloom, iris],
                borderRadius: 8
            }]
        },
        options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    scales: { x: { max: 100, ticks: { callback: v => v + '%' } } },
    plugins: { legend: { display: false } }
}
    });

    // ----------Symptom Distribution----------
    new Chart(document.getElementById('symptomChart'), {
        type: 'radar',
        data: {
            labels: ['Weight Gain', 'Hair Growth', 'Hair Loss', 'Skin Darkening', 'Acne', 'Fast Food', 'Irregular Cycle'],
            datasets: [{
                label: 'Present',
                data: [
                    answers.weight_gain, answers.hair_growth, answers.hair_loss,
                    answers.skin_darkening, answers.pimples, answers.fast_food,
                    answers.cycle_regularity
                ],
                backgroundColor: 'rgba(194, 87, 142, 0.2)',
                borderColor: bloom,
                pointBackgroundColor: bloom
            }]
        },
        options: {
    maintainAspectRatio: false,
    scales: { r: { min: 0, max: 1, ticks: { display: false } } },
    plugins: { legend: { display: false } }
}
    });

});