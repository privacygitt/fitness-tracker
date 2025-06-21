
# 💪 FitTrack - Personal Fitness Dashboard

FitTrack is a mobile-friendly, interactive **fitness tracking web application** built with **React**, **Tailwind CSS**, and **Chart.js**. It helps users visualize their workouts, track progress, analyze trends, and export summaries — all in a clean, responsive UI.

Live Demo: [🔗 View on Netlify](https://fitness-tracker-vinay.netlify.app/)  
GitHub: [🔗 View Repository](https://github.com/privacygitt/fitness-tracker)

---

## 🚀 Features

- 📈 **Activity Trends**: Visualize step count, calories, and sleep data over time.
- 🧮 **Workout Summary**: See weekly stats — time, calories, intensity & export to PDF.
- 🎯 **Goal Progress**: Track progress against fitness goals (steps, calories, etc.).
- 📝 **Activity Log**: View, sort, edit, or delete workouts.
- 📊 **Workout Distribution Chart**: Donut chart showing workout type distribution.
- 🌙 **Responsive & Mobile-Friendly**: Fully optimized for all screen sizes.
- 📤 **PDF & Image Export**: Export charts and stats easily.
- 🔔 **Notifications & Header Time Display**.

---

## 📂 Folder Structure

```
fitness-tracker/
├── public/
├── src/
│   ├── components/         # All major UI components
│   ├── data/               # Mock fitness data (e.g., `fitnessData.ts`)
│   ├── App.tsx             # Main app layout and routing
│   └── index.css / main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🧠 How It Works

### 1. **Homepage (Header.tsx)**  
- Displays greeting based on current time.  
- Shows live clock and motivational quote that refreshes.  
- Includes dropdown for quick navigation (Goal, Activity Log, Summary, etc.).

### 2. **Activity Trends (ActivityChart.tsx)**  
- Line chart comparing current and previous performance (steps, sleep, calories).
- Toggle between "Daily", "Weekly", "Monthly".
- Option to export chart as image or PDF.

### 3. **Workout Summary (WorkoutSummary.tsx)**  
- Weekly total sessions, time, calories, and high intensity percentage.
- Visual progress bar comparing to weekly goal.
- Option to download full summary as PDF.

### 4. **Goal Progress (GoalProgress.tsx)**  
- Show each goal’s progress bar and percentage.
- Editable targets inline.
- Awards (🥇Gold, Silver, Bronze) based on progress.

### 5. **Workout Chart (WorkoutChart.tsx)**  
- Donut chart showing distribution of workout types by week or month.
- Toggle visibility of each workout type.
- Displays focused workout area.

### 6. **Activity Log (ActivityLog.tsx)**  
- Search, filter by workout type, sort by date/calories/time.
- Inline edit or delete individual workout entries.
- Pagination and summary stats.

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/privacygitt/fitness-tracker.git
cd fitness-tracker
```

### 2. Install Dependencies

```bash
npm install
```

> If you encounter peer dependency errors, use:
```bash
npm install --legacy-peer-deps
```

### 3. Start the Dev Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment (Netlify)

### 1. **Build the App**

```bash
npm run build
```

### 2. **Deploy to Netlify**
- Login to [Netlify](https://app.netlify.com/).
- Click **“Add new site > Import from Git”**.
- Connect your GitHub repo.
- Set **build command**: `npm run build`
- Set **publish directory**: `dist`
- Click **“Deploy Site”**.

✅ Done! Your fitness tracker is now live on the internet.

---

## 🔧 Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **Charts**: Chart.js via `react-chartjs-2`
- **Export Tools**: `html2canvas` & `jspdf`
- **Icons**: `lucide-react`
- **Build Tool**: Vite

---

## 🙌 Acknowledgements

Special thanks to:

- [Chart.js](https://www.chartjs.org/)
- [Lucide Icons](https://lucide.dev/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://github.com/parallax/jsPDF)

---

## 📌 Author

Developed by **Damarasinghu Vinay Kumar**  
GitHub: [privacygitt](https://github.com/privacygitt)

---

## 📃 License

