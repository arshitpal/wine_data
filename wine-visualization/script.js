// Global variables
let wineData = [];
let filteredData = [];

// Load and parse CSV data
async function loadData() {
    try {
        const response = await fetch('Wine Quality Dataset.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        wineData = lines.slice(1).map(line => {
            const values = line.split(',');
            const wine = {};
            headers.forEach((header, index) => {
                const value = values[index];
                wine[header] = isNaN(value) ? value : parseFloat(value);
            });
            return wine;
        });
        
        filteredData = [...wineData];
        
        // Hide loading and show content
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        // Initialize dashboard
        initializeDashboard();
        updateAllCharts();
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('loading').textContent = 'Error loading data. Please check the CSV file.';
    }
}

// Initialize dashboard controls
function initializeDashboard() {
    // Set up event listeners
    document.getElementById('qualityFilter').addEventListener('change', filterData);
    document.getElementById('alcoholRange').addEventListener('input', filterData);
    document.getElementById('xAxis').addEventListener('change', updateInteractiveScatter);
    document.getElementById('yAxis').addEventListener('change', updateInteractiveScatter);
    
    // Update alcohol range display
    const alcoholRange = document.getElementById('alcoholRange');
    const alcoholValue = document.getElementById('alcoholValue');
    alcoholRange.addEventListener('input', () => {
        alcoholValue.textContent = `≤ ${parseFloat(alcoholRange.value).toFixed(1)}%`;
    });
}

// Filter data based on controls
function filterData() {
    const qualityFilter = document.getElementById('qualityFilter').value;
    const alcoholMax = parseFloat(document.getElementById('alcoholRange').value);
    
    filteredData = wineData.filter(wine => {
        // Quality filter
        let qualityMatch = true;
        if (qualityFilter === '3-5') {
            qualityMatch = wine.quality >= 3 && wine.quality <= 5;
        } else if (qualityFilter === '6-7') {
            qualityMatch = wine.quality >= 6 && wine.quality <= 7;
        } else if (qualityFilter === '8-9') {
            qualityMatch = wine.quality >= 8 && wine.quality <= 9;
        }
        
        // Alcohol filter
        const alcoholMatch = wine.alcohol <= alcoholMax;
        
        return qualityMatch && alcoholMatch;
    });
    
    updateAllCharts();
}

// Update all charts
function updateAllCharts() {
    updateStats();
    updateQualityChart();
    updateScatterChart();
    updateCorrelationChart();
    updateAlcoholChart();
    updateInteractiveScatter();
    updateHeatmapChart();
}

// Update statistics
function updateStats() {
    const totalWines = filteredData.length;
    const avgQuality = (filteredData.reduce((sum, wine) => sum + wine.quality, 0) / totalWines).toFixed(1);
    const avgAlcohol = (filteredData.reduce((sum, wine) => sum + wine.alcohol, 0) / totalWines).toFixed(1);
    const qualities = filteredData.map(wine => wine.quality);
    const qualityRange = `${Math.min(...qualities)}-${Math.max(...qualities)}`;
    
    document.getElementById('totalWines').textContent = totalWines.toLocaleString();
    document.getElementById('avgQuality').textContent = avgQuality;
    document.getElementById('avgAlcohol').textContent = avgAlcohol + '%';
    document.getElementById('qualityRange').textContent = qualityRange;
}

// Quality distribution chart
function updateQualityChart() {
    const qualityCounts = {};
    filteredData.forEach(wine => {
        qualityCounts[wine.quality] = (qualityCounts[wine.quality] || 0) + 1;
    });
    
    const trace = {
        x: Object.keys(qualityCounts).map(Number),
        y: Object.values(qualityCounts),
        type: 'bar',
        marker: {
            color: 'rgba(102, 126, 234, 0.8)',
            line: {
                color: 'rgba(102, 126, 234, 1)',
                width: 2
            }
        },
        hovertemplate: 'Quality: %{x}<br>Count: %{y}<extra></extra>'
    };
    
    const layout = {
        xaxis: { title: 'Quality Rating' },
        yaxis: { title: 'Number of Wines' },
        margin: { t: 20, r: 20, b: 50, l: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('qualityChart', [trace], layout, {responsive: true});
}

// Scatter plot: Alcohol vs Quality
function updateScatterChart() {
    const trace = {
        x: filteredData.map(wine => wine.alcohol),
        y: filteredData.map(wine => wine.quality),
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 6,
            color: filteredData.map(wine => wine.quality),
            colorscale: 'Viridis',
            showscale: true,
            colorbar: {
                title: 'Quality'
            }
        },
        hovertemplate: 'Alcohol: %{x}%<br>Quality: %{y}<extra></extra>'
    };
    
    const layout = {
        xaxis: { title: 'Alcohol Content (%)' },
        yaxis: { title: 'Quality Rating' },
        margin: { t: 20, r: 20, b: 50, l: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('scatterChart', [trace], layout, {responsive: true});
}

// Correlation heatmap for key properties
function updateCorrelationChart() {
    const properties = ['fixed acidity', 'volatile acidity', 'citric acid', 'pH', 'alcohol', 'quality'];
    const correlationMatrix = [];
    
    properties.forEach(prop1 => {
        const row = [];
        properties.forEach(prop2 => {
            const correlation = calculateCorrelation(
                filteredData.map(wine => wine[prop1]),
                filteredData.map(wine => wine[prop2])
            );
            row.push(correlation);
        });
        correlationMatrix.push(row);
    });
    
    const trace = {
        z: correlationMatrix,
        x: properties,
        y: properties,
        type: 'heatmap',
        colorscale: 'RdBu',
        zmid: 0,
        hovertemplate: '%{y} vs %{x}<br>Correlation: %{z:.3f}<extra></extra>'
    };
    
    const layout = {
        margin: { t: 20, r: 20, b: 80, l: 80 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('correlationChart', [trace], layout, {responsive: true});
}

// Alcohol content histogram
function updateAlcoholChart() {
    const trace = {
        x: filteredData.map(wine => wine.alcohol),
        type: 'histogram',
        nbinsx: 20,
        marker: {
            color: 'rgba(118, 75, 162, 0.8)',
            line: {
                color: 'rgba(118, 75, 162, 1)',
                width: 1
            }
        },
        hovertemplate: 'Alcohol: %{x}%<br>Count: %{y}<extra></extra>'
    };
    
    const layout = {
        xaxis: { title: 'Alcohol Content (%)' },
        yaxis: { title: 'Frequency' },
        margin: { t: 20, r: 20, b: 50, l: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('alcoholChart', [trace], layout, {responsive: true});
}

// Interactive scatter plot with selectable axes
function updateInteractiveScatter() {
    const xVar = document.getElementById('xAxis').value;
    const yVar = document.getElementById('yAxis').value;
    
    const trace = {
        x: filteredData.map(wine => wine[xVar]),
        y: filteredData.map(wine => wine[yVar]),
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 8,
            color: filteredData.map(wine => wine.quality),
            colorscale: 'Plasma',
            showscale: true,
            colorbar: {
                title: 'Quality',
                x: 1.02
            },
            opacity: 0.7
        },
        hovertemplate: `${xVar}: %{x}<br>${yVar}: %{y}<br>Quality: %{marker.color}<extra></extra>`
    };
    
    const layout = {
        xaxis: { title: xVar.charAt(0).toUpperCase() + xVar.slice(1) },
        yaxis: { title: yVar.charAt(0).toUpperCase() + yVar.slice(1) },
        margin: { t: 20, r: 60, b: 50, l: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('interactiveScatter', [trace], layout, {responsive: true});
}

// Comprehensive heatmap of all properties
function updateHeatmapChart() {
    const properties = [
        'fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar',
        'chlorides', 'free sulfur dioxide', 'total sulfur dioxide', 'density',
        'pH', 'sulphates', 'alcohol', 'quality'
    ];
    
    // Calculate average values for each quality level
    const qualityLevels = [...new Set(filteredData.map(wine => wine.quality))].sort();
    const heatmapData = [];
    
    qualityLevels.forEach(quality => {
        const winesOfQuality = filteredData.filter(wine => wine.quality === quality);
        const row = [];
        
        properties.forEach(prop => {
            const avg = winesOfQuality.reduce((sum, wine) => sum + wine[prop], 0) / winesOfQuality.length;
            row.push(avg);
        });
        
        heatmapData.push(row);
    });
    
    const trace = {
        z: heatmapData,
        x: properties.map(prop => prop.replace(/\b\w/g, l => l.toUpperCase())),
        y: qualityLevels.map(q => `Quality ${q}`),
        type: 'heatmap',
        colorscale: 'Viridis',
        hovertemplate: '%{y}<br>%{x}<br>Average: %{z:.2f}<extra></extra>'
    };
    
    const layout = {
        margin: { t: 20, r: 20, b: 120, l: 80 },
        xaxis: { tickangle: -45 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('heatmapChart', [trace], layout, {responsive: true});
}

// Helper function to calculate correlation
function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', loadData);