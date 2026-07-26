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

    // ---------- Patient Summary ----------
   document.getElementById('patientId').textContent = result.patient_id;
    document.getElementById('assessDate').textContent = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
    document.getElementById('patientAge').textContent = answers.age + ' yrs';
    document.getElementById('patientBmi').textContent = bmi.toFixed(1);
    document.getElementById('patientHeight').textContent = answers.height + ' cm';
    document.getElementById('patientWeight').textContent = answers.weight + ' kg';

    // ---------- AI Diagnosis ----------
    const riskLabelEl = document.getElementById('riskLabel');
    const diagnosisCard = document.getElementById('diagnosisCard');
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceText = document.getElementById('confidenceText');

    riskLabelEl.textContent = result.risk_label;
    confidenceText.textContent = result.confidence + '% confidence';

    setTimeout(function () {
        confidenceBar.style.width = result.confidence + '%';
    }, 100);

    if (result.prediction === 1) {
        diagnosisCard.classList.add('risk-high');
    } else {
        diagnosisCard.classList.add('risk-low');
    }

    // ---------- BMI Analysis ----------
    let bmiCategory, bmiCatClass;
    if (bmi < 18.5) { bmiCategory = 'Underweight'; bmiCatClass = 'cat-low'; }
    else if (bmi < 25) { bmiCategory = 'Normal'; bmiCatClass = 'cat-good'; }
    else if (bmi < 30) { bmiCategory = 'Overweight'; bmiCatClass = 'cat-warn'; }
    else { bmiCategory = 'Obese'; bmiCatClass = 'cat-high'; }

    document.getElementById('bmiBig').textContent = bmi.toFixed(1);
    const bmiCatBadge = document.getElementById('bmiCatBadge');
    bmiCatBadge.textContent = bmiCategory;
    bmiCatBadge.classList.add(bmiCatClass);

    const scaleMin = 15, scaleMax = 40;
    const clampedBmi = Math.min(Math.max(bmi, scaleMin), scaleMax);
    const markerPercent = ((clampedBmi - scaleMin) / (scaleMax - scaleMin)) * 100;
    setTimeout(function () {
        document.getElementById('bmiScaleMarker').style.left = markerPercent + '%';
    }, 100);

    // ---------- Daily Health Summary ----------
    const waterLiters = (answers.weight * 35 / 1000).toFixed(1);
    document.getElementById('waterIntake').textContent = waterLiters + ' L';

    const bmr = (10 * answers.weight) + (6.25 * answers.height) - (5 * answers.age) - 161;
    const activityMultiplier = answers.reg_exercise === 1 ? 1.55 : 1.2;
    const estimatedCalories = Math.round(bmr * activityMultiplier);
    document.getElementById('calorieTarget').textContent = estimatedCalories;
    document.getElementById('activityLevel').textContent = answers.reg_exercise === 1 ? '30+ min/day' : 'Start light';

    // ---------- Recommendation Cards ----------
    const isHighRisk = result.prediction === 1;

    let nutritionTip;
    if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
        nutritionTip = 'Focus on portion control and reducing refined carbs and fried food.';
    } else if (answers.fast_food === 1) {
        nutritionTip = 'Cutting back on fast food can meaningfully improve hormonal balance.';
    } else {
        nutritionTip = 'Maintain a balanced diet rich in fiber, lean protein, and healthy fats.';
    }
    document.getElementById('recNutrition').textContent = nutritionTip;

    let exerciseTip;
    if (answers.reg_exercise === 0 && isHighRisk) {
        exerciseTip = 'Start with 20-30 min of brisk walking daily — consistency matters more than intensity.';
    } else if (answers.reg_exercise === 0) {
        exerciseTip = 'Aim to introduce light cardio 3-4 times a week.';
    } else {
        exerciseTip = 'Keep up your routine — consider adding strength training twice a week.';
    }
    document.getElementById('recExercise').textContent = exerciseTip;

    let lifestyleTip;
    if (answers.cycle_regularity === 1) {
        lifestyleTip = 'Track your cycle consistently and discuss irregularities with a doctor.';
    } else {
        lifestyleTip = 'Continue monitoring your cycle monthly to catch any changes early.';
    }
    document.getElementById('recLifestyle').textContent = lifestyleTip;

    document.getElementById('recSleep').textContent = isHighRisk
        ? 'Aim for 7-8 hours nightly — poor sleep is linked to worsened hormonal symptoms.'
        : 'Maintain your current sleep schedule of 7-8 hours for hormonal balance.';
// ---------- PDF Report Download ----------
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Generating...';

            fetch('/download-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: document.getElementById('patientId').textContent,
                    answers: answers,
                    result: result
                })
            })
                .then(response => response.blob())
                .then(function (blob) {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'PCOSense_Report.pdf';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = 'Download Report (PDF)';
                })
                .catch(function (error) {
                    console.error('Report download failed:', error);
                    alert('Could not generate the report. Please try again.');
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = 'Download Report (PDF)';
                });
        });
    }
});