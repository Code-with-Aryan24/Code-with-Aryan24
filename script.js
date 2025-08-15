class SoundAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.recording = false;
        this.audioData = [];
        this.frequencyData = [];
        this.volumeData = [];
        this.spectralData = [];
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.status = document.getElementById('status');
        this.countdown = document.getElementById('countdown');
        this.analysisSection = document.getElementById('analysisSection');
        this.summary = document.getElementById('summary');
        this.recommendations = document.getElementById('recommendations');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startRecording());
    }

    async startRecording() {
        try {
            this.startBtn.disabled = true;
            this.startBtn.classList.add('recording');
            this.status.textContent = 'Requesting microphone access...';
            
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            this.status.textContent = 'Recording in progress...';
            this.recording = true;
            
            // Initialize audio context and analyzer
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            
            // Configure analyzer
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Connect nodes
            this.microphone.connect(this.analyser);
            
            // Start data collection
            this.collectAudioData();
            
            // Start countdown
            this.startCountdown();
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.status.textContent = 'Error: Could not access microphone. Please check permissions.';
            this.startBtn.disabled = false;
            this.startBtn.classList.remove('recording');
        }
    }

    collectAudioData() {
        if (!this.recording) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const frequencyArray = new Uint8Array(bufferLength);
        const timeDomainArray = new Uint8Array(bufferLength);
        
        this.analyser.getByteFrequencyData(frequencyArray);
        this.analyser.getByteTimeDomainData(timeDomainArray);
        
        // Calculate RMS volume
        let rms = 0;
        for (let i = 0; i < timeDomainArray.length; i++) {
            rms += (timeDomainArray[i] - 128) ** 2;
        }
        rms = Math.sqrt(rms / timeDomainArray.length);
        
        // Store data
        this.frequencyData.push([...frequencyArray]);
        this.volumeData.push(rms);
        this.spectralData.push(this.calculateSpectralCentroid(frequencyArray));
        
        // Continue collecting if still recording
        if (this.recording) {
            requestAnimationFrame(() => this.collectAudioData());
        }
    }

    calculateSpectralCentroid(frequencyArray) {
        let weightedSum = 0;
        let sum = 0;
        
        for (let i = 0; i < frequencyArray.length; i++) {
            const frequency = i * this.audioContext.sampleRate / (this.analyser.fftSize * 2);
            const magnitude = frequencyArray[i] / 255;
            
            weightedSum += frequency * magnitude;
            sum += magnitude;
        }
        
        return sum > 0 ? weightedSum / sum : 0;
    }

    startCountdown() {
        let timeLeft = 5;
        
        const countdownInterval = setInterval(() => {
            this.countdown.textContent = timeLeft;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                this.stopRecording();
            }
        }, 1000);
    }

    stopRecording() {
        this.recording = false;
        this.startBtn.classList.remove('recording');
        this.countdown.textContent = '';
        this.status.textContent = 'Analysis complete!';
        
        // Stop microphone stream
        if (this.microphone && this.microphone.mediaStream) {
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
        }
        
        // Analyze collected data
        this.analyzeData();
        
        // Re-enable button
        this.startBtn.disabled = false;
    }

    analyzeData() {
        // Calculate averages and statistics
        const avgVolume = this.volumeData.reduce((a, b) => a + b, 0) / this.volumeData.length;
        const maxVolume = Math.max(...this.volumeData);
        const minVolume = Math.min(...this.volumeData);
        
        const avgSpectralCentroid = this.spectralData.reduce((a, b) => a + b, 0) / this.spectralData.length;
        
        // Determine noise level category
        const noiseLevel = this.categorizeNoiseLevel(avgVolume);
        
        // Generate volume recommendations
        const recommendations = this.generateVolumeRecommendations(noiseLevel, avgVolume);
        
        // Display results
        this.displayResults(avgVolume, maxVolume, minVolume, avgSpectralCentroid, noiseLevel);
        this.displayRecommendations(recommendations);
        
        // Show analysis section
        this.analysisSection.style.display = 'block';
        this.analysisSection.classList.add('success');
        
        // Create charts
        this.createCharts();
    }

    categorizeNoiseLevel(avgVolume) {
        if (avgVolume < 10) return 'Very Quiet';
        if (avgVolume < 20) return 'Quiet';
        if (avgVolume < 35) return 'Moderate';
        if (avgVolume < 50) return 'Loud';
        return 'Very Loud';
    }

    generateVolumeRecommendations(noiseLevel, avgVolume) {
        const recommendations = [];
        
        switch (noiseLevel) {
            case 'Very Quiet':
                recommendations.push('Use low volume (20-30%) for comfortable listening');
                recommendations.push('Consider using headphones for better audio quality');
                recommendations.push('Background noise is minimal - audio clarity should be excellent');
                break;
            case 'Quiet':
                recommendations.push('Use moderate-low volume (30-40%)');
                recommendations.push('Good environment for detailed audio content');
                recommendations.push('No need for high volume levels');
                break;
            case 'Moderate':
                recommendations.push('Use medium volume (40-60%) for balanced audio');
                recommendations.push('Consider slight volume increase for clarity');
                recommendations.push('Background noise may affect audio perception');
                break;
            case 'Loud':
                recommendations.push('Use higher volume (60-80%) to overcome background noise');
                recommendations.push('Consider noise-cancelling headphones');
                recommendations.push('Audio may need to be louder for clear understanding');
                break;
            case 'Very Loud':
                recommendations.push('Use high volume (70-90%) to ensure audio is audible');
                recommendations.push('Strongly recommend noise-cancelling headphones');
                recommendations.push('Background noise significantly impacts audio quality');
                break;
        }
        
        // Add specific recommendations based on volume levels
        if (avgVolume > 40) {
            recommendations.push('Consider moving to a quieter location if possible');
        }
        
        if (avgVolume < 15) {
            recommendations.push('Perfect environment for audio content - no adjustments needed');
        }
        
        return recommendations;
    }

    displayResults(avgVolume, maxVolume, minVolume, avgSpectralCentroid, noiseLevel) {
        this.summary.innerHTML = `
            <div class="summary-item">
                <strong>Noise Level:</strong> ${noiseLevel}
            </div>
            <div class="summary-item">
                <strong>Average Volume:</strong> ${avgVolume.toFixed(2)} dB
            </div>
            <div class="summary-item">
                <strong>Peak Volume:</strong> ${maxVolume.toFixed(2)} dB
            </div>
            <div class="summary-item">
                <strong>Minimum Volume:</strong> ${minVolume.toFixed(2)} dB
            </div>
            <div class="summary-item">
                <strong>Spectral Centroid:</strong> ${avgSpectralCentroid.toFixed(0)} Hz
            </div>
            <div class="summary-item">
                <strong>Recording Duration:</strong> 5 seconds
            </div>
        `;
    }

    displayRecommendations(recommendations) {
        this.recommendations.innerHTML = recommendations.map(rec => 
            `<div class="recommendation-item">• ${rec}</div>`
        ).join('');
    }

    createCharts() {
        // Frequency Analysis Chart
        this.createFrequencyChart();
        
        // Volume Levels Chart
        this.createVolumeChart();
        
        // Spectral Analysis Chart
        this.createSpectralChart();
    }

    createFrequencyChart() {
        const ctx = document.getElementById('frequencyChart').getContext('2d');
        const avgFrequencyData = this.frequencyData[0] || new Array(1024).fill(0);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: avgFrequencyData.length}, (_, i) => 
                    Math.round(i * this.audioContext.sampleRate / (this.analyser.fftSize * 2))
                ),
                datasets: [{
                    label: 'Frequency Response',
                    data: avgFrequencyData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Frequency (Hz)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Magnitude'
                        }
                    }
                }
            }
        });
    }

    createVolumeChart() {
        const ctx = document.getElementById('volumeChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: this.volumeData.length}, (_, i) => i + 1),
                datasets: [{
                    label: 'Volume Over Time',
                    data: this.volumeData,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Volume (dB)'
                        }
                    }
                }
            }
        });
    }

    createSpectralChart() {
        const ctx = document.getElementById('spectralChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({length: this.spectralData.length}, (_, i) => i + 1),
                datasets: [{
                    label: 'Spectral Centroid',
                    data: this.spectralData,
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    borderColor: '#4caf50',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frequency (Hz)'
                        }
                    }
                }
            }
        });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SoundAnalyzer();
});

// Add some CSS for the summary items
const style = document.createElement('style');
style.textContent = `
    .summary-item {
        padding: 8px 0;
        border-bottom: 1px solid #eee;
    }
    .summary-item:last-child {
        border-bottom: none;
    }
    .recommendation-item {
        padding: 8px 0;
        color: #1976d2;
        font-weight: 500;
    }
`;
document.head.appendChild(style);