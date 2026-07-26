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
    const isHighRisk = result.prediction === 1;
    const alreadyActive = answers.reg_exercise === 1;

    // ---------- Core recommendations ----------
    let walking, yoga, steps;

    if (!alreadyActive && (isHighRisk || bmi >= 25)) {
        walking = '30-40 min, 5 days/week';
        yoga = '20 min daily (focus: hormone-balancing poses)';
        steps = '7,000 steps/day';
    } else if (!alreadyActive) {
        walking = '20-30 min, 4 days/week';
        yoga = '15 min daily';
        steps = '6,000 steps/day';
    } else {
        walking = '30 min, 5 days/week (maintain)';
        yoga = '15-20 min, 3 days/week';
        steps = '9,000 steps/day';
    }

    document.getElementById('walkingDuration').textContent = walking;
    document.getElementById('yogaDuration').textContent = yoga;
    document.getElementById('stepGoal').textContent = steps;

    // ---------- Weekly schedule ----------
    let schedule;
    if (!alreadyActive) {
        schedule = [
            ['Mon', 'Brisk walk 20 min'], ['Tue', 'Yoga / stretching'],
            ['Wed', 'Brisk walk 20 min'], ['Thu', 'Rest or light stretching'],
            ['Fri', 'Brisk walk 20 min'], ['Sat', 'Yoga / stretching'],
            ['Sun', 'Rest']
        ];
    } else {
        schedule = [
            ['Mon', 'Cardio 30 min'], ['Tue', 'Strength training'],
            ['Wed', 'Yoga / stretching'], ['Thu', 'Cardio 30 min'],
            ['Fri', 'Strength training'], ['Sat', 'Light walk + stretching'],
            ['Sun', 'Rest']
        ];
    }

    
    function getActivityIcon(activity) {
        const a = activity.toLowerCase();
        if (a.includes('rest')) return 'fa-mug-hot';
        if (a.includes('yoga') || a.includes('stretch')) return 'fa-spa';
        if (a.includes('strength')) return 'fa-dumbbell';
        if (a.includes('cardio')) return 'fa-heart-pulse';
        return 'fa-person-walking';
    }

    const weekGrid = document.getElementById('weekSchedule');
    schedule.forEach(function ([day, activity], index) {
        const row = document.createElement('div');
        row.className = 'week-row';
        row.innerHTML = `
            <span class="week-day-badge">${day}</span>
            <i class="fa-solid ${getActivityIcon(activity)} week-icon"></i>
            <span class="week-activity">${activity}</span>
        `;
        weekGrid.appendChild(row);
    });

});