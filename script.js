document.getElementById('intake-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        product: document.getElementById('product').value,
        audience: document.getElementById('audience').value,
        problem: document.getElementById('problem').value,
        alternatives: document.getElementById('alternatives').value,
        price: parseFloat(document.getElementById('price').value),
        cost_per_sale: parseFloat(document.getElementById('cost_per_sale').value),
        channels: document.getElementById('channels').value,
        timestamp: new Date().getTime()
    };

    saveIdea(formData);
    displayResults(formData);
});

function saveIdea(data) {
    let ideas = JSON.parse(localStorage.getItem('side_hustle_ideas')) || [];
    ideas.push(data);
    localStorage.setItem('side_hustle_ideas', JSON.stringify(ideas));
}

function displayResults(data) {
    document.getElementById('form-card').classList.add('hidden');
    document.getElementById('results-card').classList.remove('hidden');
    
    document.getElementById('display-product').innerText = data.product;
    
    // Profit Calc
    const profit = data.price - data.cost_per_sale;
    document.getElementById('profit-calc').innerText = `$${profit.toFixed(2)}`;

    // Scoring Logic (PLACEHOLDER - Replace with your specific rules)
    const scores = {
        marketNeed: Math.min(100, (data.problem.length > 20 ? 80 : 40) + (data.alternatives.length < 10 ? 20 : 0)),
        targetClarity: data.audience.length > 10 ? 90 : 50,
        profitability: (data.price / (data.cost_per_sale || 1)) > 3 ? 95 : 40,
        distribution: data.channels.length > 0 ? 85 : 30,
        uniqueness: data.product.length > 10 ? 75 : 50
    };

    const scoreReasons = {
        marketNeed: "The pain point is clearly defined.",
        targetClarity: "Your target audience is specific.",
        profitability: "The margins allow for healthy growth.",
        distribution: "You have clear paths to reach customers.",
        uniqueness: "The value prop stands out."
    };

    const scoreContainer = document.getElementById('score-bars');
    scoreContainer.innerHTML = '';
    
    for (let key in scores) {
        const score = scores[key];
        scoreContainer.innerHTML += `
            <div class="progress-container">
                <div style="display:flex; justify-content:space-between; font-weight:bold;">
                    <span>${key.replace('marketNeed', 'Market Need').replace('targetClarity', 'Targeting').replace('profitability', 'Profit').replace('distribution', 'Channels').replace('uniqueness', 'Uniqueness')}</span>
                    <span>${Math.round(score)}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${score}%"></div>
                </div>
                <small>${scoreReasons[key]}</small>
            </div>
        `;
    }

    // Flags & Verdict
    const greenFlags = document.getElementById('green-flags');
    const redFlags = document.getElementById('red-flags');
    const verdictBadge = document.getElementById('verdict-badge');
    const fixHighlight = document.getElementById('fix-highlight');

    greenFlags.innerHTML = "✅ High profit margin detected.";
    redFlags.innerHTML = "⚠️ Distribution channels need more specificity.";
    
    // Simple Logic for Verdict
    const avgScore = Object.values(scores).reduce((a, b) => a + b) / 5;
    if (avgScore > 80) {
        verdictBadge.innerText = "Go build it!";
        verdictBadge.style.backgroundColor = "var(--primary)";
        verdictBadge.style.color = "white";
        fixHighlight.innerText = "Scale the distribution immediately.";
    } else if (avgScore > 50) {
        verdictBadge.innerText = "Test it first";
        verdictBadge.style.backgroundColor = "#f1c40f";
        verdictBadge.style.color = "black";
        fixHighlight.innerText = "Validate the 'problem' with 5 customer interviews.";
    } else {
        verdictBadge.innerText = "Rethink the angle";
        verdictBadge.style.backgroundColor = "var(--red)";
        verdictBadge.style.color = "white";
        fixHighlight.innerText = "The cost per sale is too high relative to the price.";
    }

    renderChecklist();
}

// Sprint Checklist Logic
const tasks = [
    "Identify 3 specific customers",
    "Draft a landing page wireframe",
    "Create a prototype/MVP",
    "Set up social media handles",
    "Reach out to 10 leads",
    "Gather first piece of feedback",
    "Finalize pricing & plan"
];

function renderChecklist() {
    const container = document.getElementById('checklist');
    const streakEl = document.getElementById('streak-count');
    const streak = localStorage.getItem('hustle_streak') || 0;
    streakEl.innerText = streak;

    container.innerHTML = '';
    tasks.forEach((task, index) => {
        const itemId = `task-${index}`;
        const isChecked = localStorage.getItem(itemId) === 'true';
        container.innerHTML += `
            <div class="checklist-item">
                <input type="checkbox" id="${itemId}" ${isChecked ? 'checked' : ''}>
                <label for="${itemId}" style="margin:0; font-size: 1rem;">${task}</label>
            </div>
        `;
    });

    // Handle checkbox clicks
    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (e) => {
            localStorage.setItem(e.target.id, e.target.checked);
        });
    });
}

document.getElementById('complete-day-btn').addEventListener('click', () => {
    let currentStreak = parseInt(localStorage.getItem('hustle_streak') || 0);
    localStorage.setItem('hustle_streak', currentStreak + 1);
    alert("Day complete! Streak updated.");
    renderChecklist();
});
