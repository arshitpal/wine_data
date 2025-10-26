// Wine Quality Dashboard - Enhanced with Futuristic Theme
let wineData = [];
let filteredData = [];

// Futuristic color schemes
const colorSchemes = {
    primary: ['#00d4ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff4757', '#7bed9f', '#70a1ff'],
    gradient: ['#0f0f23', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    neon: ['#00d4ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff4757']
};

// Generate sample wine data
function generateSampleData() {
    const data = [];
    const qualities = [3, 4, 5, 6, 7, 8, 9];
    const wineTypes = ['Red', 'White', 'Rosé'];
    
    for (let i = 0; i < 1500; i++) {
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const wineType = wineTypes[Math.floor(Math.random() * wineTypes.length)];
        
        data.push({
            'fixed acidity': (Math.random() * 10 + 4).toFixed(2),
            'volatile acidity': (Math.random() * 1.2 + 0.1).toFixed(3),
            'citric acid': (Math.random() * 0.8).toFixed(3),
            'residual sugar': (Math.random() * 15 + 0.5).toFixed(2),
            'chlorides': (Math.random() * 0.4 + 0.01).toFixed(3),
            'free sulfur dioxide': Math.floor(Math.random() * 60 + 5),
            'total sulfur dioxide': Math.floor(Math.random() * 250 + 20),
            'density': (Math.random() * 0.01 + 0.99).toFixed(4),
            'pH': (Math.random() * 1.5 + 2.8).toFixed(2),
            'sulphates': (Math.random() * 1.5 + 0.3).toFixed(2),
            'alcohol': (Math.random() * 7 + 8).toFixed(1),
            'quality': quality,
            'type': wineType
        });
    }
    return data;
}

// Initialize dashboard
async function initDashboard() {
    try {
        // Show loading animation
        const loadingElement = document.getElementById('loading');
        loadingElement.innerHTML = `
            <div style="font-family: 'Orbitron', monospace; color: #00d4ff;">
                🍷 Initializing Wine Analysis System...
                <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                    Loading quantum wine data matrices
                </div>
            </div>
        `;
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate sample data
        wineData = generateSampleData();
        filteredData = [...wineData];
        
        // Hide loading and show content with fade effect
        loadingElement.style.opacity = '0';
        setTimeout(() => {
            loadingElement.style.display = 'none';
            const mainContent = document.getElementById('main-content');
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            
            // Fade in main content
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.8s ease';
                mainContent.style.opacity = '1';
            }, 100);
        }, 300);
        
        // Setup event listeners first
        setupEventListeners();
        
        // Initialize all charts with staggered loading
        setTimeout(() => updateStats(), 200);
        setTimeout(() => createQualityChart(), 400);
        setTimeout(() => createScatterChart(), 600);
        setTimeout(() => createCorrelationChart(), 800);
        setTimeout(() => createAlcoholChart(), 1000);
        setTimeout(() => createInteractiveScatter(), 1200);
        setTimeout(() => createHeatmapChart(), 1400);
        setTimeout(() => create3DChart(), 1600);
        
    } catch (error) {
        handleError(error, 'dashboard initialization');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Quality filter dropdown
    const qualityFilter = document.getElementById('qualityFilter');
    if (qualityFilter) {
        qualityFilter.addEventListener('change', function() {
            console.log('Quality filter changed to:', this.value);
            filterData();
        });
    }
    
    // Alcohol range slider
    const alcoholRange = document.getElementById('alcoholRange');
    if (alcoholRange) {
        alcoholRange.addEventListener('input', function() {
            document.getElementById('alcoholValue').textContent = `≤ ${this.value}%`;
            filterData();
        });
    }
    
    // X-axis dropdown
    const xAxis = document.getElementById('xAxis');
    if (xAxis) {
        xAxis.addEventListener('change', function() {
            console.log('X-axis changed to:', this.value);
            updateInteractiveScatter();
        });
    }
    
    // Y-axis dropdown
    const yAxis = document.getElementById('yAxis');
    if (yAxis) {
        yAxis.addEventListener('change', function() {
            console.log('Y-axis changed to:', this.value);
            updateInteractiveScatter();
        });
    }
}

// Filter data based on controls with smooth transitions
function filterData() {
    try {
        const qualityFilter = document.getElementById('qualityFilter').value;
        const alcoholMax = parseFloat(document.getElementById('alcoholRange').value);
        
        filteredData = wineData.filter(wine => {
            const quality = wine.quality;
            const alcohol = parseFloat(wine.alcohol);
            
            let qualityMatch = true;
            if (qualityFilter === '3-5') qualityMatch = quality >= 3 && quality <= 5;
            else if (qualityFilter === '6-7') qualityMatch = quality >= 6 && quality <= 7;
            else if (qualityFilter === '8-9') qualityMatch = quality >= 8 && quality <= 9;
            
            return qualityMatch && alcohol <= alcoholMax;
        });
        
        // Update all visualizations with smooth transitions
        updateStats();
        
        // Stagger chart updates for smooth performance
        setTimeout(() => createQualityChart(), 50);
        setTimeout(() => createScatterChart(), 100);
        setTimeout(() => createCorrelationChart(), 150);
        setTimeout(() => createAlcoholChart(), 200);
        setTimeout(() => updateInteractiveScatter(), 250);
        setTimeout(() => createHeatmapChart(), 300);
        setTimeout(() => create3DChart(), 350);
        
    } catch (error) {
        handleError(error, 'data filtering');
    }
}

// Update statistics with animations
function updateStats() {
    const totalWines = filteredData.length;
    const avgQuality = filteredData.reduce((sum, wine) => sum + wine.quality, 0) / totalWines;
    const avgAlcohol = filteredData.reduce((sum, wine) => sum + parseFloat(wine.alcohol), 0) / totalWines;
    const qualities = filteredData.map(wine => wine.quality);
    const qualityRange = `${Math.min(...qualities)}-${Math.max(...qualities)}`;
    
    // Animate the values
    const totalElement = document.getElementById('totalWines');
    const qualityElement = document.getElementById('avgQuality');
    const alcoholElement = document.getElementById('avgAlcohol');
    const rangeElement = document.getElementById('qualityRange');
    
    // Get current values for smooth transitions
    const currentTotal = parseInt(totalElement.textContent.replace(/,/g, '')) || 0;
    const currentQuality = parseFloat(qualityElement.textContent) || 0;
    const currentAlcohol = parseFloat(alcoholElement.textContent.replace('%', '')) || 0;
    
    animateValue(totalElement, currentTotal, totalWines, 800);
    animateValue(qualityElement, currentQuality, avgQuality, 800);
    
    // Animate alcohol percentage
    const alcoholStart = currentAlcohol;
    const alcoholEnd = avgAlcohol;
    const alcoholStartTime = performance.now();
    
    function updateAlcohol(currentTime) {
        const elapsed = currentTime - alcoholStartTime;
        const progress = Math.min(elapsed / 800, 1);
        const current = alcoholStart + ((alcoholEnd - alcoholStart) * easeOutQuart(progress));
        alcoholElement.textContent = current.toFixed(1) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(updateAlcohol);
        }
    }
    requestAnimationFrame(updateAlcohol);
    
    rangeElement.textContent = qualityRange;
}

// Create quality distribution chart
function createQualityChart() {
    const qualityCounts = {};
    filteredData.forEach(wine => {
        qualityCounts[wine.quality] = (qualityCounts[wine.quality] || 0) + 1;
    });
    
    const trace = {
        x: Object.keys(qualityCounts),
        y: Object.values(qualityCounts),
        type: 'bar',
        marker: {
            color: colorSchemes.primary,
            line: {
                color: '#00d4ff',
                width: 2
            }
        },
        hovertemplate: '<b>Quality %{x}</b><br>Count: %{y}<extra></extra>'
    };
    
    const layout = {
        ...getChartConfig(),
        xaxis: {
            title: 'Wine Quality',
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed',
            showline: true,
            linecolor: 'rgba(0, 212, 255, 0.3)'
        },
        yaxis: {
            title: 'Count',
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed',
            showline: true,
            linecolor: 'rgba(0, 212, 255, 0.3)'
        },
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        }
    };
    
    Plotly.newPlot('qualityChart', [trace], layout, {
        responsive: true, 
        displayModeBar: false,
        staticPlot: false
    });
}

// Create scatter chart
function createScatterChart() {
    const trace = {
        x: filteredData.map(wine => parseFloat(wine.alcohol)),
        y: filteredData.map(wine => wine.quality),
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 8,
            color: filteredData.map(wine => wine.quality),
            colorscale: [
                [0, '#ff4757'],
                [0.5, '#ffaa00'],
                [1, '#00ff88']
            ],
            showscale: true,
            colorbar: {
                title: 'Quality',
                titlefont: { color: '#e0e6ed' },
                tickfont: { color: '#e0e6ed' }
            },
            line: {
                color: '#00d4ff',
                width: 1
            }
        },
        hovertemplate: '<b>Alcohol: %{x}%</b><br>Quality: %{y}<extra></extra>'
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e6ed', family: 'Inter' },
        xaxis: {
            title: 'Alcohol Content (%)',
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed'
        },
        yaxis: {
            title: 'Quality',
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed'
        },
        margin: { t: 20, r: 20, b: 50, l: 50 }
    };
    
    Plotly.newPlot('scatterChart', [trace], layout, {responsive: true, displayModeBar: false});
}

// Create correlation chart
function createCorrelationChart() {
    const properties = ['fixed acidity', 'volatile acidity', 'citric acid', 'alcohol', 'pH', 'quality'];
    const correlationMatrix = [];
    
    properties.forEach(prop1 => {
        const row = [];
        properties.forEach(prop2 => {
            const values1 = filteredData.map(wine => parseFloat(wine[prop1]));
            const values2 = filteredData.map(wine => parseFloat(wine[prop2]));
            row.push(calculateCorrelation(values1, values2));
        });
        correlationMatrix.push(row);
    });
    
    const trace = {
        z: correlationMatrix,
        x: properties,
        y: properties,
        type: 'heatmap',
        colorscale: [
            [0, '#ff4757'],
            [0.5, '#1a1a2e'],
            [1, '#00ff88']
        ],
        showscale: true,
        colorbar: {
            title: 'Correlation',
            titlefont: { color: '#e0e6ed' },
            tickfont: { color: '#e0e6ed' }
        },
        hovertemplate: '<b>%{y} vs %{x}</b><br>Correlation: %{z:.3f}<extra></extra>'
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e6ed', family: 'Inter' },
        xaxis: { color: '#e0e6ed', tickangle: 45 },
        yaxis: { color: '#e0e6ed' },
        margin: { t: 20, r: 20, b: 100, l: 100 }
    };
    
    Plotly.newPlot('correlationChart', [trace], layout, {responsive: true, displayModeBar: false});
}

// Create alcohol distribution chart
function createAlcoholChart() {
    const alcoholValues = filteredData.map(wine => parseFloat(wine.alcohol));
    
    const trace = {
        x: alcoholValues,
        type: 'histogram',
        nbinsx: 20,
        marker: {
            color: 'rgba(0, 212, 255, 0.7)',
            line: {
                color: '#00d4ff',
                width: 2
            }
        },
        hovertemplate: '<b>Alcohol: %{x}%</b><br>Count: %{y}<extra></extra>'
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e6ed', family: 'Inter' },
        xaxis: {
            title: 'Alcohol Content (%)',
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed'
        },
        yaxis: {
            title: 'Frequency',
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed'
        },
        margin: { t: 20, r: 20, b: 50, l: 50 }
    };
    
    Plotly.newPlot('alcoholChart', [trace], layout, {responsive: true, displayModeBar: false});
}

// Create interactive scatter plot
function createInteractiveScatter() {
    updateInteractiveScatter();
}

function updateInteractiveScatter() {
    const xVar = document.getElementById('xAxis').value;
    const yVar = document.getElementById('yAxis').value;
    
    const trace = {
        x: filteredData.map(wine => parseFloat(wine[xVar])),
        y: filteredData.map(wine => parseFloat(wine[yVar])),
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 10,
            color: filteredData.map(wine => wine.quality),
            colorscale: [
                [0, '#ff4757'],
                [0.3, '#ffaa00'],
                [0.6, '#00d4ff'],
                [1, '#00ff88']
            ],
            showscale: true,
            colorbar: {
                title: 'Quality',
                titlefont: { color: '#e0e6ed' },
                tickfont: { color: '#e0e6ed' }
            },
            line: {
                color: '#00d4ff',
                width: 1
            },
            opacity: 0.8
        },
        hovertemplate: `<b>${xVar}: %{x}</b><br>${yVar}: %{y}<br>Quality: %{marker.color}<extra></extra>`
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e6ed', family: 'Inter' },
        xaxis: {
            title: xVar.charAt(0).toUpperCase() + xVar.slice(1),
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed'
        },
        yaxis: {
            title: yVar.charAt(0).toUpperCase() + yVar.slice(1),
            gridcolor: 'rgba(0, 212, 255, 0.2)',
            color: '#e0e6ed'
        },
        margin: { t: 20, r: 20, b: 50, l: 50 }
    };
    
    Plotly.newPlot('interactiveScatter', [trace], layout, {responsive: true, displayModeBar: false});
}

// Create heatmap chart
function createHeatmapChart() {
    const properties = ['fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar', 'pH', 'alcohol'];
    const qualityLevels = [3, 4, 5, 6, 7, 8, 9];
    
    const heatmapData = qualityLevels.map(quality => {
        const winesOfQuality = filteredData.filter(wine => wine.quality === quality);
        return properties.map(prop => {
            if (winesOfQuality.length === 0) return 0;
            const avg = winesOfQuality.reduce((sum, wine) => sum + parseFloat(wine[prop]), 0) / winesOfQuality.length;
            return avg;
        });
    });
    
    const trace = {
        z: heatmapData,
        x: properties,
        y: qualityLevels,
        type: 'heatmap',
        colorscale: [
            [0, '#0f0f23'],
            [0.25, '#1a1a2e'],
            [0.5, '#16213e'],
            [0.75, '#0f3460'],
            [1, '#00d4ff']
        ],
        showscale: true,
        colorbar: {
            title: 'Average Value',
            titlefont: { color: '#e0e6ed' },
            tickfont: { color: '#e0e6ed' }
        },
        hovertemplate: '<b>Quality %{y}</b><br>%{x}: %{z:.2f}<extra></extra>'
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e6ed', family: 'Inter' },
        xaxis: { 
            color: '#e0e6ed', 
            tickangle: 45,
            title: 'Wine Properties'
        },
        yaxis: { 
            color: '#e0e6ed',
            title: 'Quality Level'
        },
        margin: { t: 20, r: 20, b: 100, l: 60 }
    };
    
    Plotly.newPlot('heatmapChart', [trace], layout, {responsive: true, displayModeBar: false});
}

// Create 3D chart
function create3DChart() {
    const trace = {
        x: filteredData.map(wine => parseFloat(wine.alcohol)),
        y: filteredData.map(wine => parseFloat(wine['fixed acidity'])),
        z: filteredData.map(wine => wine.quality),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            size: 5,
            color: filteredData.map(wine => wine.quality),
            colorscale: [
                [0, '#ff4757'],
                [0.3, '#ffaa00'],
                [0.6, '#00d4ff'],
                [1, '#00ff88']
            ],
            showscale: true,
            colorbar: {
                title: 'Quality',
                titlefont: { color: '#e0e6ed' },
                tickfont: { color: '#e0e6ed' }
            },
            opacity: 0.8
        },
        hovertemplate: '<b>Alcohol: %{x}%</b><br>Fixed Acidity: %{y}<br>Quality: %{z}<extra></extra>'
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e6ed', family: 'Inter' },
        scene: {
            xaxis: {
                title: 'Alcohol Content (%)',
                color: '#e0e6ed',
                gridcolor: 'rgba(0, 212, 255, 0.3)'
            },
            yaxis: {
                title: 'Fixed Acidity',
                color: '#e0e6ed',
                gridcolor: 'rgba(0, 212, 255, 0.3)'
            },
            zaxis: {
                title: 'Quality',
                color: '#e0e6ed',
                gridcolor: 'rgba(0, 212, 255, 0.3)'
            },
            bgcolor: 'rgba(0,0,0,0)'
        },
        margin: { t: 20, r: 20, b: 20, l: 20 }
    };
    
    Plotly.newPlot('threeDChart', [trace], layout, {responsive: true, displayModeBar: false});
}

// Utility function to calculate correlation
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

// Create animated particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        // Random colors from our neon palette
        const colors = ['#00d4ff', '#ff00ff', '#00ff88', '#ffaa00'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
    }
}

// Enhanced chart configurations with better styling
function getChartConfig() {
    return {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { 
            color: '#e0e6ed', 
            family: 'Inter, sans-serif',
            size: 12
        },
        showlegend: false,
        margin: { t: 20, r: 20, b: 50, l: 50 },
        hovermode: 'closest'
    };
}

// Add smooth transitions and animations
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const change = end - start;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (change * easeOutQuart(progress));
        
        if (typeof end === 'number' && end % 1 !== 0) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Easing function for smooth animations
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Enhanced error handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.innerHTML = `
            <div style="color: #ff4757; font-family: 'Orbitron', monospace;">
                ⚠️ Error loading ${context}<br>
                <small style="opacity: 0.7;">Please refresh the page</small>
            </div>
        `;
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initDashboard();
});