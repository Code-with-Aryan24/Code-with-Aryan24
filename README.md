# 🔊 Sound Analyzer - Volume Moderation Tool

A modern web application that analyzes background noise using your device's microphone to provide personalized volume recommendations for optimal audio experiences.

## 🌟 Features

- **Real-time Audio Analysis**: Uses Web Audio API for precise sound analysis
- **5-Second Recording**: Quick, non-intrusive background noise sampling
- **Comprehensive Analytics**: Frequency analysis, volume levels, and spectral data
- **Smart Recommendations**: AI-powered volume suggestions based on environment
- **Beautiful Visualizations**: Interactive charts using Chart.js
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Privacy-Focused**: All processing happens locally in your browser

## 🚀 How It Works

1. **Click "Start Recording"** - The app requests microphone access
2. **5-Second Analysis** - Records and analyzes background noise
3. **Data Processing** - Analyzes frequency, volume, and spectral characteristics
4. **Results Display** - Shows comprehensive analysis with interactive charts
5. **Volume Recommendations** - Provides personalized suggestions for optimal device volume

## 📊 Analysis Components

### Frequency Analysis
- Real-time frequency response visualization
- Identifies dominant frequency ranges in your environment
- Helps understand the type of background noise

### Volume Levels
- Tracks volume changes over the 5-second recording period
- Calculates average, peak, and minimum volume levels
- Provides noise level categorization (Very Quiet to Very Loud)

### Spectral Analysis
- Spectral centroid calculation for frequency distribution analysis
- Helps identify the "brightness" or "darkness" of ambient sound
- Useful for understanding noise characteristics

## 🎯 Volume Recommendations

The app categorizes your environment and provides specific recommendations:

- **Very Quiet (0-10 dB)**: Low volume (20-30%) recommended
- **Quiet (10-20 dB)**: Moderate-low volume (30-40%) recommended
- **Moderate (20-35 dB)**: Medium volume (40-60%) recommended
- **Loud (35-50 dB)**: Higher volume (60-80%) recommended
- **Very Loud (50+ dB)**: High volume (70-90%) recommended

## 🛠️ Technical Requirements

- Modern web browser with Web Audio API support
- Microphone access permission
- HTTPS connection (required for microphone access in most browsers)

### Browser Compatibility
- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 79+

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Adaptive layouts for different screen sizes
- Optimized for mobile browsers
- Works with mobile device microphones

## 🚀 Getting Started

### Option 1: Open Directly
1. Download all files to a folder
2. Open `index.html` in your web browser
3. Grant microphone permissions when prompted
4. Click "Start Recording" to begin analysis

### Option 2: Local Server (Recommended)
1. Install a local server (e.g., Python, Node.js, or Live Server extension)
2. Serve the files from a local directory
3. Access via `http://localhost:port`

### Option 3: Deploy Online
1. Upload files to any web hosting service
2. Ensure HTTPS is enabled (required for microphone access)
3. Access your deployed application

## 🔧 File Structure

```
sound-analyzer/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript application logic
└── README.md           # This documentation
```

## 🎨 Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layouts
- Update the gradient backgrounds and color schemes
- Adjust responsive breakpoints for different devices

### Analysis Parameters
- Modify recording duration in `script.js` (currently 5 seconds)
- Adjust frequency analysis settings (FFT size, smoothing)
- Customize noise level thresholds and recommendations

### Charts
- Update chart colors and styles in the chart creation functions
- Modify chart types and configurations
- Add additional visualization options

## 🔒 Privacy & Security

- **No Data Storage**: All audio processing happens locally in your browser
- **No Network Requests**: No audio data is sent to external servers
- **Local Processing**: Complete privacy with client-side analysis
- **Permission-Based**: Only accesses microphone when explicitly requested

## 🐛 Troubleshooting

### Microphone Access Issues
- Ensure you're using HTTPS (required for microphone access)
- Check browser permissions for microphone access
- Try refreshing the page and granting permissions again
- Verify your microphone is working in other applications

### No Audio Analysis
- Check browser console for error messages
- Ensure Web Audio API is supported in your browser
- Verify microphone permissions are granted
- Try using a different browser

### Charts Not Displaying
- Check if Chart.js is loading properly
- Verify internet connection for CDN resources
- Check browser console for JavaScript errors

## 🤝 Contributing

Feel free to contribute to this project:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Web Audio API for audio processing capabilities
- Chart.js for beautiful data visualizations
- Inter font family for modern typography
- Web development community for best practices

---

**Built with ❤️ for better audio experiences**

*Optimize your device volume based on your surroundings and enjoy crystal-clear audio quality!*
